'use strict';

const groupsService = require('../services/groups.service');

const listGroups = async (_req, res, next) => {
  try {
    const groups = await groupsService.getAllGroups();
    res.json(groups);
  } catch (err) {
    next(err);
  }
};

const getGroup = async (req, res, next) => {
  try {
    const group = await groupsService.getGroupById(req.params.id);
    res.json(group);
  } catch (err) {
    next(err);
  }
};

const createGroup = async (req, res, next) => {
  try {
    const { name, description, targetAmount, currency } = req.body;
    if (!name || !targetAmount) {
      return res.status(400).json({ error: 'name and targetAmount are required' });
    }
    const group = await groupsService.createGroup({ name, description, targetAmount, currency });
    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
};

const contribute = async (req, res, next) => {
  try {
    const contribution = await groupsService.addContribution(req.params.id, req.body);
    res.status(201).json(contribution);
  } catch (err) {
    next(err);
  }
};

module.exports = { listGroups, getGroup, createGroup, contribute };
