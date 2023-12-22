
import { default as EvaluationsService } from '../../../../services/evaluations.srvc';
import { default as EvaluatedService } from '../../../../services/evaluated.srvc';

export default async (
  evaluationId: string,
  enterpriseId: number
) => {
  const res: any = {
    previous: undefined,
    answerCount: 0
  };

  const current: any = await EvaluationsService.findById(evaluationId, 'questionnaire deliveredAt');
  res.previous = await EvaluationsService.findOnePrevious(evaluationId, enterpriseId, current.questionnaire, current.deliveredAt, 'slug populationLeaders');

  if (res.previous && res.previous._id) {
    res.answerCount = await EvaluatedService.countCompletedByEvaluationRef(res.previous._id);
    res.leadersAnswerCount = await EvaluatedService.countCompletedByEvaluationRefInIds(res.previous._id, res.previous.populationLeaders);
  }

  return res;
};
