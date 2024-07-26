import { codeController } from '../controller/codeController.js';
const { getCode, getCodeByOption, createCode } = codeController();

import express from 'express';

const codeRouter = express.Router();

codeRouter.route('/').get(getCode);

codeRouter.route('/:searchCode').get(getCodeByOption);

codeRouter.route('/create-code').post(createCode);

codeRouter.route('/edit-code/:codeId').put();

codeRouter.route('/delete-code/:codeId').put();

export default codeRouter;
