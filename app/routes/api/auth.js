const express = require('express');

const { auth: ctrl } = require('../../controllers');
const ctrlWrapper = require('../../helpers/ctrlWrapper');

const router = express.Router();

router.post('/add', ctrlWrapper(ctrl.signup));

router.post('/login', ctrlWrapper(ctrl.login));

module.exports = router;
