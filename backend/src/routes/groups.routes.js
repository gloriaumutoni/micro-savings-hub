'use strict';

const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const { requireGroupOwner } = require('../middleware/authorize');
const c = require('../controllers/groups.controller');

const router = Router();

// All group routes require authentication
router.use(authenticate);

// NOTE: /join/:token must come before /:id to avoid route collision
router.post('/join/:token', c.joinGroup);

router.get('/', c.listGroups);
router.post('/', c.createGroup);
router.get('/:id', c.getGroup);
router.patch('/:id', requireGroupOwner(), c.updateGroup);
router.post('/:id/close', requireGroupOwner(), c.closeGroup);
router.post('/:id/invite', requireGroupOwner(), c.generateInvite);
router.post('/:id/contribute', c.contribute);
router.delete('/:id/members/me', c.leaveGroup);
router.delete('/:id/members/:userId', requireGroupOwner(), c.removeMember);

module.exports = router;
