'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRouter = require('./src/routes/auth.routes');
const groupsRouter = require('./src/routes/groups.routes');
const adminRouter = require('./src/routes/admin.routes');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'micro-savings-hub-api',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/admin', adminRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
