const express = require('express')
const app = express();

app.use(require('./wsp'))

module.exports = app;