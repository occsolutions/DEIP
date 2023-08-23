
import { default as EvaluationsService } from '../../../../services/evaluations.srvc';
import { default as EvaluationAnswersService } from '../../../../services/evaluation-answers.srvc';

export default async (
  evaluationId: string,
  enterpriseId: number
) => {
  const res = {
    previous: undefined,
    answerCount: 0
  };

  const current = await EvaluationsService.findById(evaluationId, 'questionnaire deliveredAt');
  res.previous = await EvaluationsService.findOnePrevious(evaluationId, enterpriseId, current.questionnaire, current.deliveredAt, 'slug');

  if (res.previous && res.previous._id) {
    res.answerCount = await EvaluationAnswersService.countByEvaluationId(res.previous._id);
  }

  return res;
};
