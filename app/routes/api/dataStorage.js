const express = require('express');

const { storage: ctrl } = require('../../controllers');
const { joiSchema } = require('../../models/data');
const ctrlWrapper = require('../../helpers/ctrlWrapper');
const authenticate = require('../../middleware/authenticate');
const validateBody = require('../../middleware/validateBody');

const router = express.Router();

router.post(
  '/league',
  authenticate,
  validateBody(joiSchema.addLeague),
  ctrlWrapper(ctrl.addLeague)
);
router.patch(
  '/league/:leagueId',
  authenticate,
  validateBody(joiSchema.renameLeague),
  ctrlWrapper(ctrl.changeLeagueName)
);

router.delete(
  '/league/:leagueId',
  authenticate,
  ctrlWrapper(ctrl.deleteLeague)
);

router.post(
  '/addurl',
  authenticate,
  validateBody(joiSchema.addUrl),
  ctrlWrapper(ctrl.addUrl)
);

router.get('/list/:championship', authenticate, ctrlWrapper(ctrl.getDataList));

router.put('/clear', authenticate, ctrlWrapper(ctrl.clearDataList));

router.post(
  '/teamname',
  authenticate,
  validateBody(joiSchema.addTeam),
  ctrlWrapper(ctrl.addTeamName)
);

router.get(
  '/teamname/:championship',
  authenticate,
  ctrlWrapper(ctrl.getTeamNames)
);

router.patch(
  '/teamname',
  authenticate,
  validateBody(joiSchema.renameTeam),
  ctrlWrapper(ctrl.changeTeamName)
);

router.delete('/teamname/:teamId', authenticate, ctrlWrapper(ctrl.deleteTeam));

module.exports = router;
