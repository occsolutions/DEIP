
import { default as EvaluatedService } from '../../../../services/evaluated.srvc';

import { IDimensionScatter } from '../contracts/scatter-dimension';
import { IAnswersDimension } from '../contracts/answers-dimension';

import AnswersUtils from '../utils/answers';

export default async (
  evaluationId: string,
  alreadyProcessedAnswersCount: number,
  answersForScatter: IDimensionScatter,
  answersDimension: IAnswersDimension
) => {
  const chunkSize = 100;
  const fields = 'temp';
  const answersBatch: any = await EvaluatedService.findByBatchByEvaluationId(evaluationId, alreadyProcessedAnswersCount, chunkSize, fields);

  // Run Answers Dimension
  for (let i = 0; i < answersBatch.length; i++) {
    const temp = AnswersUtils.runAnswersDimension(
      answersBatch[i].temp,
      answersForScatter,
      answersDimension,
      false
    );
    answersForScatter = temp.scatter;
    answersDimension = temp.evaluations;
  }

  return {
    processedAnswers: answersBatch.length,
    answersForScatter,
    answersDimension
  };
};
