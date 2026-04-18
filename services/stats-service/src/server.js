'use strict';
require('dotenv').config();
const app = require('./app');
const { port } = require('./config');

app.listen(port, () => {
  console.log(`[Stats Service] Running on port ${port}`);
});
