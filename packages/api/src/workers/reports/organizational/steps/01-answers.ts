
import { default as EvaluationAnswersService } from '../../../../services/evaluation-answers.srvc';

import { IDimensionScatter } from '../contracts/scatter-dimension';
import { IAnswersDimension } from '../contracts/answers-dimension';
import { IIndicesAnswers } from '../contracts/indices-answers';
import { IOpenAnswers } from '../contracts/open-answers';

import AnswersUtils from '../utils/answers';

export default async (
  evaluationId: string,
  alreadyProcessedAnswersCount: number,
  answersForScatter: IDimensionScatter,
  answersDimension: IAnswersDimension,
  indicesAnswers: IIndicesAnswers,
  openAnswers: IOpenAnswers
) => {
  const chunkSize = 100;
  const fields = 'evaluations indices openQuestions';
  const answersBatch = await EvaluationAnswersService.findBatchByEvaluationId(evaluationId, alreadyProcessedAnswersCount, chunkSize, fields);

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
      false
    );
    answersForScatter = temp.scatter;
    answersDimension = temp.evaluations;
    indicesAnswers = temp.indices;
    openAnswers = temp.open;
  }

  return {
    processedAnswers: answersBatch.length,
    answersForScatter,
    answersDimension,
    indicesAnswers,
    openAnswers
  };
};
