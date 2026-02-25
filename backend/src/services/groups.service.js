'use strict';

const pool = require('../config/db');

const getAllGroups = async () => {
  const { rows } = await pool.query(
    `SELECT id, name, description, target_amount, currency, total_saved, created_at
     FROM groups
     ORDER BY created_at DESC`
  );
  return rows;
};

const getGroupById = async (id) => {
  const { rows: groupRows } = await pool.query(
    `SELECT id, name, description, target_amount, currency, total_saved, created_at
     FROM groups WHERE id = $1`,
    [id]
  );

  if (groupRows.length === 0) {
    const err = new Error(`Group '${id}' not found`);
    err.status = 404;
    throw err;
  }

  const { rows: contributions } = await pool.query(
    `SELECT id, member_name, amount, created_at
     FROM contributions
     WHERE group_id = $1
     ORDER BY created_at DESC`,
    [id]
  );

  return { ...groupRows[0], contributions };
};

const createGroup = async ({ name, description = '', targetAmount, currency = 'RWF' }) => {
  const { rows } = await pool.query(
    `INSERT INTO groups (name, description, target_amount, currency)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description, Number(targetAmount), currency]
  );
  return { ...rows[0], contributions: [] };
};

const addContribution = async (groupId, { memberName, amount }) => {
  const parsedAmount = Number(amount);

  if (!memberName || isNaN(parsedAmount) || parsedAmount <= 0) {
    const err = new Error('memberName and a positive amount are required');
    err.status = 400;
    throw err;
  }

  const { rowCount } = await pool.query(
    'SELECT id FROM groups WHERE id = $1',
    [groupId]
  );
  if (rowCount === 0) {
    const err = new Error(`Group '${groupId}' not found`);
    err.status = 404;
    throw err;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO contributions (group_id, member_name, amount)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [groupId, memberName, parsedAmount]
    );

    await client.query(
      `UPDATE groups SET total_saved = total_saved + $1 WHERE id = $2`,
      [parsedAmount, groupId]
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { getAllGroups, getGroupById, createGroup, addContribution };
