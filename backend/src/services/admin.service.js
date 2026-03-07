'use strict';

const pool = require('../config/db');

async function getAllGroupsAdmin() {
  const { rows } = await pool.query(
    `SELECT
       g.id, g.name, g.description,
       g.target_amount AS "targetAmount",
       g.currency, g.total_saved AS "totalSaved",
       g.status, g.end_date AS "endDate",
       g.created_at AS "createdAt",
       COUNT(DISTINCT gm.user_id) AS "memberCount",
       COUNT(DISTINCT c.id) AS "contributionCount"
     FROM groups g
     LEFT JOIN group_memberships gm ON gm.group_id = g.id
     LEFT JOIN contributions c ON c.group_id = g.id
     GROUP BY g.id
     ORDER BY g.created_at DESC`
  );
  return rows;
}

module.exports = { getAllGroupsAdmin };
