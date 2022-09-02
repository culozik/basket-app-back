const express = require('express');

const { storage: ctrl } = require('../../controllers');
const { dataJoiSchema } = require('../../models/data');
const ctrlWrapper = require('../../helpers/ctrlWrapper');
const authenticate = require('../../middleware/authenticate');
const validateBody = require('../../middleware/validateBody');

const router = express.Router();

router.post(
  '/add',
  authenticate,
  validateBody(dataJoiSchema),
  ctrlWrapper(ctrl.addData)
);

router.get('/list/:championship', authenticate, ctrlWrapper(ctrl.getDataList));

router.put(
  '/list/:championship',
  authenticate,
  ctrlWrapper(ctrl.clearDataList)
);

module.exports = router;
