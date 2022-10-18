const express = require('express');

const { auth: ctrl } = require('../../controllers');
const validateBody = require('../../middleware/validateBody');
const ctrlWrapper = require('../../helpers/ctrlWrapper');
const { JoiLoginSchema } = require('../../models/user');

const router = express.Router();

router.post('/add', ctrlWrapper(ctrl.signup));

router.post('/login', validateBody(JoiLoginSchema), ctrlWrapper(ctrl.login));

module.exports = router;
