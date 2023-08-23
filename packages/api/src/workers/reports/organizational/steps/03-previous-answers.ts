
import { default as EvaluationAnswersService } from '../../../../services/evaluation-answers.srvc';

import { IDimensionScatter } from '../contracts/scatter-dimension';
import { IAnswersDimension } from '../contracts/answers-dimension';
import { IIndicesAnswers } from '../contracts/indices-answers';
import { IOpenAnswers } from '../contracts/open-answers';

import AnswersUtils from '../utils/answers';

export default async (
  previousEvaluationId: string,
  alreadyProcessedAnswersCount: number,
  answersForScatter: IDimensionScatter,
  answersDimension: IAnswersDimension,
  indicesAnswers: IIndicesAnswers,
  openAnswers: IOpenAnswers
) => {
  const chunkSize = 100;
  const fields = 'evaluations indices openQuestions';
  const answersBatch = await EvaluationAnswersService.findBatchByEvaluationId(previousEvaluationId, alreadyProcessedAnswersCount, chunkSize, fields);

  // Run Answers Dimension
  for (let i = 0; i < answersBatch.length; i++) {
    const temp = AnswersUtils.runAnswersDimension(
      answersBatch[i].evaluations,
      answersBatch[i].indices,
      answersBatch[i].openQuestions,
      answersForScatter,
      answersDimension,
      indicesAnswers,
      openAnswers,
      true
    );
    answersDimension = temp.evaluations;
    indicesAnswers = temp.indices;
  }

  return {
    processedAnswers: answersBatch.length,
    answersDimension,
    indicesAnswers
  };
};
