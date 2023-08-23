
import { Request, Response } from 'express';
import slugify from 'slugify';

import { default as QuestionnairesService } from '../services/questionnaires.srvc';
import { default as QuestionsIndexService } from '../services/question-index.srvc';
import IRequest from './contracts/request';

class QuestionnairesController {

  async list(req: Request, res: Response) {
    const questionnaires = await QuestionnairesService.list();
    res.send({items: questionnaires});
  }

  async filtered(req: IRequest, res: Response) {
    try {
      res.status(200).send({
        items: await QuestionnairesService.filtered(req.user.customer.id, req.user.enterprise.id, req.user.enterprise.sectorId)
      });
    } catch (error) {
      res.send({
        msg: 'Not found',
        status: 404
      });
    }
  }

  async create(req: Request, res: Response) {
    const name = req.body.questionnaire.name;
    const slug = slugify(name, {
      lower: true
    });

    const baseQuestionnaire = await QuestionnairesService.findOneBySlug(req.body.questionnaire.baseQuestionnaire);
    const data = {
      name,
      slug,
      active: true,
      isBase: false,
      deletedAt: undefined,
      assignationType: req.body.questionnaire.assignationType,
      assignationFor: req.body.questionnaire.assignationFor,
      baseQuestionnaire: baseQuestionnaire.slug,
      evaluations: baseQuestionnaire.evaluations,
    };
    res.send(await QuestionnairesService.save(data));
  }

  async delete (req: Request, res: Response) {
    res.send(await QuestionnairesService.deleteOne(req.body.slug));
  }

  async getOne (req: Request, res: Response) {
    res.send(await QuestionnairesService.findOneBySlug(req.params.slug));
  }

  async edit (req: Request, res: Response) {
    res.send(await QuestionnairesService.update(req.params.slug, req.body.questionnaire));
  }

  async toggle (req: Request, res: Response) {
    const questionnaires = await QuestionnairesService.list();
    let activeQty = 0;
    if (!req.body.active) {
      for (const questionnaire of questionnaires) {
        if (questionnaire.active) {
          activeQty++;
        }
      }
      if (activeQty < 2) {
        res.status(400).send({
          code: 'limit'
        });
        return;
      }
    }
    res.send(await QuestionnairesService.toggle(req.params.slug, req.body.active));
  }

  async updateInfo (req: Request, res: Response) {
    res.send(await QuestionnairesService.updateQuestionnaireInfo(req.params.slug, req.body.questionnaire));
  }

  async getIndicesGroups(req: Request, res: Response) {
    const grouped: any = {};
    const groups = ['generalHealth', 'burnoutOrganizational'];
    const indexFields = 'idx answers reference question';
    for (const group of groups) {
      const indices = await QuestionsIndexService.listByIndexGroup(group, indexFields);
      grouped[group] = indices;
    }
    res.send(grouped);
  }

  async editIndexQuestion(req: Request, res: Response) {
    try {
      res.send(await QuestionsIndexService.update(req.body.data));
    } catch (error) {
      console.log(error);
      res.send({
        msg: 'Not found',
        status: 400
      });
    }
  }

}

export default new QuestionnairesController();
