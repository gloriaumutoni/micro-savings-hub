'use strict';

const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const { requireAdmin } = require('../middleware/authorize');
const { listAllGroups } = require('../controllers/admin.controller');

const router = Router();

router.get('/groups', authenticate, requireAdmin, listAllGroups);

module.exports = router;
