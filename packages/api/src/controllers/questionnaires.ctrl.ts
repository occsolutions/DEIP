
import { Request, Response } from 'express';
import slugify from 'slugify';

import { default as QuestionnairesService } from '../services/questionnaires.srvc';
import { default as QuestionsIndexService } from '../services/question-index.srvc';

import IRequest from './contracts/request';
import { BadRequestException } from '../error';
import { Question } from 'src/models/question';

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
    const parts = (req.body.questionnaire.key || '').split('_');
    if ([2, 3].indexOf(parts.length) === -1) {
      throw new BadRequestException('key-is-invalid');
    }

    const questionnaire = await QuestionnairesService.findOneBySlug(req.params.slug);
    if (parts.length === 2) {
      questionnaire.evaluations.leader[req.body.questionnaire.key].label[req.body.questionnaire.lang] = req.body.questionnaire.label
    } else {
      const setLang = (dimention, attr: string, question: string, lang: string, value: string) => {
        dimention.attrs[attr].questions[question].label[lang] = value;
        return dimention;
      }
      questionnaire.evaluations[parts[0]] = setLang(questionnaire.evaluations[parts[0]], `${parts[0]}_${parts[1]}`, req.body.questionnaire.key, req.body.questionnaire.lang, req.body.questionnaire.label)
    }

    res.send(await QuestionnairesService.update(req.params.slug, questionnaire));
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

  async questionsTypes(req: Request, res: Response) {
    const questions = await QuestionnairesService.getQuestionsType();
    res.send({items: questions});
  }

  async updateOptions(req: Request, res: Response) {
    const parts = (req.body.questionnaire.key || '').split('_');
    if ([2, 3].indexOf(parts.length) === -1) {
      throw new BadRequestException('key-is-invalid');
    }

    const questionnaire = await QuestionnairesService.findOneBySlug(req.params.slug);
    let question: Question = undefined;
    if (parts.length === 2) {
      question = questionnaire.evaluations.leader[req.body.questionnaire.key]
    } else {
      const getQuestion = (dimention, attr: string, question: string) => {
        return dimention.attrs[attr].questions[question];
      }
      question = getQuestion(questionnaire.evaluations[parts[0]], `${parts[0]}_${parts[1]}`, req.body.questionnaire.key)
    }

    if (!question) {
      throw new BadRequestException('question-is-invalid');
    }

    const questionType = await QuestionnairesService.getQuestionType(question.type);
    if (questionType.editable.length) {
      if (questionType.editable.indexOf('options') !== -1) {
        question.options = req.body.questionnaire.options
      }
      if (questionType.editable.indexOf('min') !== -1) {
        question.min = req.body.questionnaire.min
      }
      if (questionType.editable.indexOf('limit') !== -1) {
        question.limit = req.body.questionnaire.limit
      }
    }

    res.send(await QuestionnairesService.update(req.params.slug, questionnaire));
  }
}

export default new QuestionnairesController();
