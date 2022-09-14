const express = require('express');

const { worker: ctrl } = require('../../controllers');
const ctrlWrapper = require('../../helpers/ctrlWrapper');

const router = express.Router();

router.post('/analyze', ctrlWrapper(ctrl.analyzeData));

module.exports = router;
