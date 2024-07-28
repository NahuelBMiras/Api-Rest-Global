import { isAdmin } from '../middleware/isAdmin.js';
import { codeController } from '../controller/codeController.js';
const {
  getCode,
  getCodeByOption,
  createCode,
  createCodeLanguage,
  editCode,
  editCodeLanguage,
  deleteCode,
  deleteCodeLanguage,
} = codeController();

import express from 'express';

const codeRouter = express.Router();

codeRouter.route('/').get(getCode);

codeRouter.route('/search').get(getCodeByOption);

codeRouter.route('/create-code').post(createCode);

codeRouter.route('/create-code-language').post(createCodeLanguage);

codeRouter.route('/edit-code').put(editCode);
codeRouter.route('/edit-code-language').put(editCodeLanguage);

codeRouter.route('/delete-code').delete(isAdmin, deleteCode);

codeRouter.route('/delete-code-language').delete(isAdmin, deleteCodeLanguage);

export default codeRouter;
