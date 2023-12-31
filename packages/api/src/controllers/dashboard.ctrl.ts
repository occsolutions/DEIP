
import { Request, Response } from 'express';

import { default as ProductServiceService } from '../services/product-service.srvc';
import { default as EvaluationsService } from '../services/evaluations.srvc';
import { default as EvaluatedService } from '../services/evaluated.srvc';

import IRequest from './contracts/request';

const calculateProgress = (evaluatedTemp, questions, isLeader) => {
  let totalQuestions = 0;
  let answeredCount = 0;
  for (const key of Object.keys(questions)) {
    switch (key) {
      case 'segmentation':
        const additionalSegmentations = Object.keys(questions[key]);
        if (additionalSegmentations.length > 0) {
          // Questions Count
          for (const ky of additionalSegmentations) {
            if (questions[key][ky] && questions[key][ky].selected) {
              totalQuestions++;
            }
          }
          // Answers Count
          if (evaluatedTemp[key]) {
            evaluatedTemp[key].forEach(a => {
              if (a.detailId) {
                answeredCount++;
              }
            });
          }
        }
        break;

      case 'evaluations':
        // Questions Count
        for (const dimKey of Object.keys(questions[key])) {
          const dimension = questions[key][dimKey];
          if (dimension.attrs) {
            for (const attrKey of Object.keys(dimension.attrs)) {
              const attribute = dimension.attrs[attrKey];
              for (const qKey of Object.keys(attribute.questions)) {
                totalQuestions++;
              }
            }
          } else {
            if (isLeader) {
              for (const qKey of Object.keys(dimension)) {
                totalQuestions++;
              }
            }
          }
        }
        // Answers Count
        if (evaluatedTemp[key]) {
          evaluatedTemp[key].forEach(a => {
            a.attribute.forEach(q => {
              if (q.score.length) {
                answeredCount++;
              }
            });
          });
        }
        break;

      case 'additional':
        // Questions Count
        totalQuestions += questions[key].length;
        // Answers Count
        if (evaluatedTemp[key]) {
          evaluatedTemp[key].forEach(a => {
            if (a.answer[0]) {
              answeredCount++;
            }
          });
        }
        break;
    }
  }

  return Math.round((answeredCount * 100) / totalQuestions);
};

class DashboardController {

  async getEmployeeInfo(req: Request, res: Response) {
    const response: {
      productService: any,
      token: any,
      evaluation: any,
      score: any,
    }[] = [];
    let evaluationsEmployee;
    const populationFields = 'status token indEmpEntId evaluationRef temp';
    if (req.body.employeeId) {
      evaluationsEmployee = await EvaluatedService.findManyByEmployeeId(req.body.employeeId, populationFields);
    } else {
      evaluationsEmployee = await EvaluatedService.findManyByEmployeeEnterpriseId(req.body.employeeEnterpriseId, populationFields);
    }
    const productService = await ProductServiceService.findByName('MEDICIÓN DEIP');

    for (const evaluated of evaluationsEmployee) {
      const evaluation = await EvaluationsService.findInProgressById(evaluated.evaluationRef, 'name displayName status additionalSegmentation questionnaire.evaluations additionalQuestions populationLeaders');
      if (!evaluation) continue;

      const evaluationQuestions = {
        segmentation: evaluation.additionalSegmentation,
        evaluations: evaluation.questionnaire.evaluations,
        additional: evaluation.additionalQuestions
      };

      if (!evaluationQuestions.segmentation) {
        delete evaluationQuestions.segmentation;
      }

      const isLeader = evaluation.populationLeaders.includes(evaluated.indEmpEntId);

      response.push({
        productService,
        token: evaluated.token,
        evaluation: {
          _id: evaluation._id,
          name: evaluation.name,
          displayName: evaluation.displayName
        },
        score: evaluated.temp ? calculateProgress(evaluated.temp, evaluationQuestions, isLeader) : 0
      });
    }
    res.send(response);
  }

  async getEnterpriseInfo(req: IRequest, res: Response) {
    const evaluations: any = await EvaluationsService.listByEnterpriseOrderByStartDate(req.user.enterprise.id);
    const evaluationsResponse: {
      team: any,
      answers: any
    }[] = [];
    for (const eva of evaluations) {
      const item = JSON.parse(JSON.stringify(eva));
      const members = await EvaluatedService.getByEvaluationRef(eva._id, 'status');
      item.team = members.length;
      item.answers = members.filter(m => m.status === 'completed').length;
      evaluationsResponse.push(item);
    }
    res.send({
      evaluations: evaluationsResponse
    });
  }

  async getAdminInfo(req: IRequest, res: Response) {
    const evaluations: any = await EvaluationsService.listByStartDate();
    const response: {
      team: any,
    }[] = [];
    for (const eva of evaluations) {
      const item = JSON.parse(JSON.stringify(eva));
      item.team = eva.populationCount;
      response.push(item);
    }
    res.send({
      evaluations: response
    });
  }

}

export default new DashboardController();
