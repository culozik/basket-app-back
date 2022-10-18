const express = require('express');

const { user: ctrl } = require('../../controllers');
const ctrlWrapper = require('../../helpers/ctrlWrapper');
const authenticate = require('../../middleware/authenticate');

const router = express.Router();

router.patch('/password', authenticate, ctrlWrapper(ctrl.changePassword));

router.get('/logout', authenticate, ctrlWrapper(ctrl.logout));

module.exports = router;
