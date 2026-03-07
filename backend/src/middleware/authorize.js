'use strict';

const pool = require('../config/db');

/**
 * Requires the authenticated user to have the system_admin role.
 */
function requireAdmin(req, res, next) {
  if (req.user.role !== 'system_admin') {
    return res.status(403).json({ status: 403, message: 'Admin access required' });
  }
  next();
}

/**
 * Requires the authenticated user to be the owner of the group.
 * @param {string} paramName - The route param name containing the group id (default: 'id')
 */
function requireGroupOwner(paramName = 'id') {
  return async (req, res, next) => {
    const groupId = req.params[paramName];
    const userId = req.user.id;

    try {
      const { rows } = await pool.query(
        `SELECT id FROM group_memberships
         WHERE group_id = $1 AND user_id = $2 AND role = 'owner'`,
        [groupId, userId]
      );

      if (rows.length === 0) {
        return res.status(403).json({ status: 403, message: 'Owner access required' });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { requireAdmin, requireGroupOwner };
