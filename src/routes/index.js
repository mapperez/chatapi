const express = require('express')
const app = express();

app.use(require('./wsp'));
app.use(require('./bots'))


module.exports = app;