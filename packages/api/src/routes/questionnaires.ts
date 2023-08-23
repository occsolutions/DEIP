
import { Router } from 'express';
import QuestionnairesController from '../controllers/questionnaires.ctrl';

export default () => {
  const QuestionnairesRouter = Router();

  QuestionnairesRouter.post(
    '/create',
    QuestionnairesController.create
  );

  QuestionnairesRouter.post(
    '/delete',
    QuestionnairesController.delete
  );

  QuestionnairesRouter.post(
    '/edit/:slug',
    QuestionnairesController.edit
  );

  QuestionnairesRouter.post(
    '/toggle/:slug',
    QuestionnairesController.toggle
  );

  QuestionnairesRouter.post(
    '/update-info/:slug',
    QuestionnairesController.updateInfo
  );

  QuestionnairesRouter.get(
    '/filtered',
    QuestionnairesController.filtered
  );

  QuestionnairesRouter.get(
    '/list',
    QuestionnairesController.list
  );

  QuestionnairesRouter.get(
    '/get-one/:slug',
    QuestionnairesController.getOne
  );

  // Questions Indices
  QuestionnairesRouter.get(
    '/indices-groups',
    QuestionnairesController.getIndicesGroups
  );

  QuestionnairesRouter.put(
    '/edit-index-question',
    QuestionnairesController.editIndexQuestion
  );

  return QuestionnairesRouter;
};
