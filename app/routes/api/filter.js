const express = require('express');

const { filter: ctrl } = require('../../controllers');
const { joiSchema } = require('../../models/filter');
const ctrlWrapper = require('../../helpers/ctrlWrapper');
const authenticate = require('../../middleware/authenticate');
const validateBody = require('../../middleware/validateBody');

const router = express.Router();

router.get('/list', authenticate, ctrlWrapper(ctrl.getFilterList));

router.post(
  '/add',
  authenticate,
  validateBody(joiSchema.addFilterLeague),
  ctrlWrapper(ctrl.addFilterLeague)
);

router.delete(
  '/filter_league/:leagueId',
  authenticate,
  ctrlWrapper(ctrl.deleteFilterLeague)
);

module.exports = router;
