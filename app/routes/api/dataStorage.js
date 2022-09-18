const express = require('express');

const { storage: ctrl } = require('../../controllers');
const { addUrlJoiSchema } = require('../../models/data');
const ctrlWrapper = require('../../helpers/ctrlWrapper');
const authenticate = require('../../middleware/authenticate');
const validateBody = require('../../middleware/validateBody');

const router = express.Router();

router.post(
  '/add',
  authenticate,
  validateBody(addUrlJoiSchema),
  ctrlWrapper(ctrl.addData)
);

router.get('/list/:championship', authenticate, ctrlWrapper(ctrl.getDataList));

router.put('/clear', authenticate, ctrlWrapper(ctrl.clearDataList));

router.post(
  '/teamname',
  authenticate,
  // validateBody(dataJoiSchema),
  ctrlWrapper(ctrl.addTeamName)
);

router.get(
  '/teamname/:championship',
  authenticate,
  ctrlWrapper(ctrl.getTeamNames)
);

router.patch('/teamname', authenticate, ctrlWrapper(ctrl.changeTeamName));

module.exports = router;
