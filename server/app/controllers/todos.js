var express = require('express'),
router = express.Router(),
logger = require('../../config/logger'),
ToDos = require('../models/todos');

module.exports = function (app, config) {
    app.use('/api', router);