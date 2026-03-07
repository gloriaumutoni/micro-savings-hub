'use strict';

const groupsService = require('../services/groups.service');

async function listGroups(req, res, next) {
  try {
    const groups = await groupsService.getAllGroups(req.user.id);
    res.json({ status: 200, data: groups });
  } catch (err) {
    next(err);
  }
}

async function getGroup(req, res, next) {
  try {
    const group = await groupsService.getGroupById(req.params.id, req.user.id);
    res.json({ status: 200, data: group });
  } catch (err) {
    next(err);
  }
}

async function createGroup(req, res, next) {
  try {
    const { name, description, targetAmount, currency, endDate } = req.body;

    if (!name || !targetAmount) {
      return res.status(400).json({ status: 400, message: 'name and targetAmount are required' });
    }

    if (isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      return res
        .status(400)
        .json({ status: 400, message: 'targetAmount must be a positive number' });
    }

    const group = await groupsService.createGroup(req.user.id, {
      name,
      description,
      targetAmount,
      currency,
      endDate,
    });

    res.status(201).json({ status: 201, data: group });
  } catch (err) {
    next(err);
  }
}

async function updateGroup(req, res, next) {
  try {
    const { name, description, targetAmount, endDate } = req.body;
    const group = await groupsService.updateGroup(req.params.id, {
      name,
      description,
      targetAmount,
      endDate,
    });
    res.json({ status: 200, data: group });
  } catch (err) {
    next(err);
  }
}

async function contribute(req, res, next) {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ status: 400, message: 'amount must be a positive number' });
    }

    const contribution = await groupsService.addContribution(req.params.id, req.user.id, amount);
    res.status(201).json({ status: 201, data: contribution });
  } catch (err) {
    next(err);
  }
}

async function closeGroup(req, res, next) {
  try {
    const result = await groupsService.closeGroup(req.params.id);
    res.json({ status: 200, data: result });
  } catch (err) {
    next(err);
  }
}

async function generateInvite(req, res, next) {
  try {
    const invite = await groupsService.generateInvite(req.params.id);
    const inviteUrl = `${req.protocol}://${req.get('host')}/api/groups/join/${invite.token}`;
    res.status(201).json({ status: 201, data: { ...invite, inviteUrl } });
  } catch (err) {
    next(err);
  }
}

async function joinGroup(req, res, next) {
  try {
    const result = await groupsService.joinViaInvite(req.params.token, req.user.id);
    res.json({ status: 200, data: result });
  } catch (err) {
    next(err);
  }
}

async function leaveGroup(req, res, next) {
  try {
    await groupsService.leaveGroup(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function removeMember(req, res, next) {
  try {
    await groupsService.removeMember(req.params.id, req.params.userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  contribute,
  closeGroup,
  generateInvite,
  joinGroup,
  leaveGroup,
  removeMember,
};
