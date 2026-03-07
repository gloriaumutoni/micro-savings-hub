'use strict';

const crypto = require('crypto');
const pool = require('../config/db');

// ─── List groups the user belongs to ─────────────────────────────────────────

async function getAllGroups(userId) {
  const { rows } = await pool.query(
    `SELECT
       g.id, g.name, g.description,
       g.target_amount AS "targetAmount",
       g.currency, g.total_saved AS "totalSaved",
       g.status, g.end_date AS "endDate",
       g.created_at AS "createdAt",
       gm.role AS "userRole"
     FROM groups g
     JOIN group_memberships gm ON gm.group_id = g.id
     WHERE gm.user_id = $1
     ORDER BY g.created_at DESC`,
    [userId]
  );
  return rows;
}

// ─── Create a group and make the creator the owner ────────────────────────────

async function createGroup(userId, { name, description, targetAmount, currency, endDate }) {
  if (endDate && new Date(endDate) <= new Date()) {
    const err = new Error('endDate must be a future date');
    err.status = 400;
    throw err;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: groupRows } = await client.query(
      `INSERT INTO groups (name, description, target_amount, currency, end_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING
         id, name, description,
         target_amount AS "targetAmount",
         currency, total_saved AS "totalSaved",
         status, end_date AS "endDate",
         created_at AS "createdAt"`,
      [name, description || null, Number(targetAmount), currency || 'RWF', endDate || null, userId]
    );

    const group = groupRows[0];

    await client.query(
      `INSERT INTO group_memberships (group_id, user_id, role) VALUES ($1, $2, 'owner')`,
      [group.id, userId]
    );

    await client.query('COMMIT');
    return { ...group, userRole: 'owner' };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ─── Get a single group (members only) ───────────────────────────────────────

async function getGroupById(groupId, userId) {
  const { rows: memberRows } = await pool.query(
    'SELECT role FROM group_memberships WHERE group_id = $1 AND user_id = $2',
    [groupId, userId]
  );

  if (memberRows.length === 0) {
    const err = new Error('Group not found or access denied');
    err.status = 403;
    throw err;
  }

  const { rows: groupRows } = await pool.query(
    `SELECT
       id, name, description,
       target_amount AS "targetAmount",
       currency, total_saved AS "totalSaved",
       status, end_date AS "endDate",
       created_at AS "createdAt"
     FROM groups WHERE id = $1`,
    [groupId]
  );

  if (groupRows.length === 0) {
    const err = new Error('Group not found');
    err.status = 404;
    throw err;
  }

  const { rows: contributions } = await pool.query(
    `SELECT
       c.id, c.amount,
       c.created_at AS "createdAt",
       u.email AS "userEmail"
     FROM contributions c
     JOIN users u ON u.id = c.user_id
     WHERE c.group_id = $1
     ORDER BY c.created_at DESC`,
    [groupId]
  );

  const group = groupRows[0];
  const progress =
    Number(group.targetAmount) > 0
      ? Math.min(100, Math.round((Number(group.totalSaved) / Number(group.targetAmount)) * 100))
      : 0;

  return { ...group, userRole: memberRows[0].role, progress, contributions };
}

// ─── Update group details (owner only) ───────────────────────────────────────

async function updateGroup(groupId, { name, description, targetAmount, endDate }) {
  if (endDate && new Date(endDate) <= new Date()) {
    const err = new Error('endDate must be a future date');
    err.status = 400;
    throw err;
  }

  const { rows } = await pool.query(
    `UPDATE groups
     SET
       name          = COALESCE($1, name),
       description   = COALESCE($2, description),
       target_amount = COALESCE($3, target_amount),
       end_date      = COALESCE($4, end_date)
     WHERE id = $5
     RETURNING
       id, name, description,
       target_amount AS "targetAmount",
       currency, total_saved AS "totalSaved",
       status, end_date AS "endDate",
       created_at AS "createdAt"`,
    [
      name || null,
      description !== undefined ? description : null,
      targetAmount ? Number(targetAmount) : null,
      endDate || null,
      groupId,
    ]
  );

  if (rows.length === 0) {
    const err = new Error('Group not found');
    err.status = 404;
    throw err;
  }

  return rows[0];
}

// ─── Record a contribution ────────────────────────────────────────────────────

async function addContribution(groupId, userId, amount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: memberRows } = await client.query(
      'SELECT role FROM group_memberships WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );
    if (memberRows.length === 0) {
      const err = new Error('You are not a member of this group');
      err.status = 403;
      throw err;
    }

    const { rows: groupRows } = await client.query(
      'SELECT status, end_date, total_saved, target_amount FROM groups WHERE id = $1',
      [groupId]
    );
    if (groupRows.length === 0) {
      const err = new Error('Group not found');
      err.status = 404;
      throw err;
    }

    const group = groupRows[0];

    if (group.end_date && new Date(group.end_date) <= new Date()) {
      await client.query(`UPDATE groups SET status = 'closed' WHERE id = $1`, [groupId]);
      const err = new Error('Group has been closed — end date has passed');
      err.status = 409;
      throw err;
    }

    if (group.status === 'closed') {
      const err = new Error('Group is closed — no further contributions allowed');
      err.status = 409;
      throw err;
    }

    const { rows: contribRows } = await client.query(
      `INSERT INTO contributions (group_id, user_id, amount)
       VALUES ($1, $2, $3)
       RETURNING id, amount, created_at AS "createdAt"`,
      [groupId, userId, Number(amount)]
    );

    const { rows: updatedRows } = await client.query(
      `UPDATE groups
       SET total_saved = total_saved + $1
       WHERE id = $2
       RETURNING total_saved, target_amount`,
      [Number(amount), groupId]
    );

    if (Number(updatedRows[0].total_saved) >= Number(updatedRows[0].target_amount)) {
      await client.query(`UPDATE groups SET status = 'closed' WHERE id = $1`, [groupId]);
    }

    await client.query('COMMIT');
    return contribRows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ─── Close a group manually ───────────────────────────────────────────────────

async function closeGroup(groupId) {
  const { rows } = await pool.query(
    `UPDATE groups SET status = 'closed' WHERE id = $1
     RETURNING id, name, status`,
    [groupId]
  );

  if (rows.length === 0) {
    const err = new Error('Group not found');
    err.status = 404;
    throw err;
  }

  return rows[0];
}

// ─── Generate an invite token ─────────────────────────────────────────────────

async function generateInvite(groupId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await pool.query(`INSERT INTO group_invites (group_id, token, expires_at) VALUES ($1, $2, $3)`, [
    groupId,
    token,
    expiresAt,
  ]);

  return { token, expiresAt };
}

// ─── Join a group via invite token ────────────────────────────────────────────

async function joinViaInvite(token, userId) {
  const { rows: inviteRows } = await pool.query(
    'SELECT id, group_id, expires_at, used FROM group_invites WHERE token = $1',
    [token]
  );

  if (inviteRows.length === 0) {
    const err = new Error('Invite not found');
    err.status = 404;
    throw err;
  }

  const invite = inviteRows[0];

  if (invite.used || new Date(invite.expires_at) < new Date()) {
    const err = new Error('Invite token has expired or already been used');
    err.status = 410;
    throw err;
  }

  const { rows: existing } = await pool.query(
    'SELECT id FROM group_memberships WHERE group_id = $1 AND user_id = $2',
    [invite.group_id, userId]
  );
  if (existing.length > 0) {
    const err = new Error('You are already a member of this group');
    err.status = 409;
    throw err;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `INSERT INTO group_memberships (group_id, user_id, role) VALUES ($1, $2, 'member')`,
      [invite.group_id, userId]
    );
    await client.query('UPDATE group_invites SET used = TRUE WHERE id = $1', [invite.id]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return { groupId: invite.group_id };
}

// ─── Leave a group ────────────────────────────────────────────────────────────

async function leaveGroup(groupId, userId) {
  const { rows } = await pool.query(
    'SELECT role FROM group_memberships WHERE group_id = $1 AND user_id = $2',
    [groupId, userId]
  );

  if (rows.length === 0) {
    const err = new Error('You are not a member of this group');
    err.status = 404;
    throw err;
  }

  if (rows[0].role === 'owner') {
    const err = new Error('Owner cannot leave — close the group or transfer ownership first');
    err.status = 400;
    throw err;
  }

  await pool.query('DELETE FROM group_memberships WHERE group_id = $1 AND user_id = $2', [
    groupId,
    userId,
  ]);
}

// ─── Remove a member (owner action) ──────────────────────────────────────────

async function removeMember(groupId, targetUserId) {
  const { rows } = await pool.query(
    'SELECT role FROM group_memberships WHERE group_id = $1 AND user_id = $2',
    [groupId, targetUserId]
  );

  if (rows.length === 0) {
    const err = new Error('User is not a member of this group');
    err.status = 404;
    throw err;
  }

  await pool.query('DELETE FROM group_memberships WHERE group_id = $1 AND user_id = $2', [
    groupId,
    targetUserId,
  ]);
}

module.exports = {
  getAllGroups,
  createGroup,
  getGroupById,
  updateGroup,
  addContribution,
  closeGroup,
  generateInvite,
  joinViaInvite,
  leaveGroup,
  removeMember,
};
