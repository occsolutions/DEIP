
import { default as EvaluatedService } from '../../../../services/evaluated.srvc';

import { IDimensionScatter } from '../contracts/scatter-dimension';
import { IAnswersDimension } from '../contracts/answers-dimension';

import AnswersUtils from '../utils/answers';

export default async (
  previousEvaluationId: string,
  alreadyProcessedAnswersCount: number,
  answersForScatter: IDimensionScatter,
  answersDimension: IAnswersDimension,
  populationLeaders: Array<number>,
  demoFilters: any
) => {
  const chunkSize = 100;
  const fields = 'indEmpEntId temp.evaluations';
  const answersBatch: any = await EvaluatedService.findByBatchByEvaluationId(previousEvaluationId, alreadyProcessedAnswersCount, chunkSize, fields);
  const filtered: any = await EvaluatedService.findByEvaluationIdAndFilterItems(previousEvaluationId, demoFilters, 'indEmpEntId');

  // Run Answers Dimension
  for (let i = 0; i < answersBatch.length; i++) {
    const temp = AnswersUtils.runAnswersDimension(
      answersBatch[i].temp.evaluations,
      answersForScatter,
      answersDimension,
      populationLeaders.includes(answersBatch[i].indEmpEntId),
      filtered.map(x => x.indEmpEntId).includes(answersBatch[i].indEmpEntId),
      true
    );
    answersDimension = temp.evaluations;
  }

  return {
    processedAnswers: answersBatch.length,
    answersDimension
  };
};
