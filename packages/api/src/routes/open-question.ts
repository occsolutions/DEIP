
import { Router } from 'express';
import OpenQuestionController from './../controllers/open-question.ctrl';


export default () => {
  const OpenQuestionRouter = Router();

  OpenQuestionRouter.get('/list', OpenQuestionController.getAll);
  OpenQuestionRouter.put('/edit-question', OpenQuestionController.editQuestion);

  return OpenQuestionRouter;
};
