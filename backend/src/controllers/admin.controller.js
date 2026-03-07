'use strict';

const { getAllGroupsAdmin } = require('../services/admin.service');

async function listAllGroups(req, res, next) {
  try {
    const groups = await getAllGroupsAdmin();
    res.json({ status: 200, data: groups });
  } catch (err) {
    next(err);
  }
}

module.exports = { listAllGroups };
