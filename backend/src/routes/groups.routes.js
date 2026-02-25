'use strict';

const { Router } = require('express');
const groupsController = require('../controllers/groups.controller');

const router = Router();

router.get('/', groupsController.listGroups);
router.post('/', groupsController.createGroup);
router.get('/:id', groupsController.getGroup);
router.post('/:id/contribute', groupsController.contribute);

module.exports = router;
