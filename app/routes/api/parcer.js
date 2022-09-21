const express = require('express');

const { worker: ctrl } = require('../../controllers');
const ctrlWrapper = require('../../helpers/ctrlWrapper');
const authenticate = require('../../middleware/authenticate');

const router = express.Router();

router.get('/analyze', authenticate, ctrlWrapper(ctrl.analyzeData));

module.exports = router;
