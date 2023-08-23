
import { default as EvaluationAnswersService } from '../../../../services/evaluation-answers.srvc';

import { IAnswersDimension } from '../contracts/answers-dimension';
import { IIndicesAnswers } from '../contracts/indices-answers';

import AnswersUtils from '../utils/answers';
import SegmentsUtils from '../utils/segments';

export default async (
  evaluationId: string,
  alreadyProcessedAnswersCount: number,
  answersDimension: IAnswersDimension,
  indicesAnswers: IIndicesAnswers,
  criteria: any,
  segmentedAnswers: any
) => {
  const chunkSize = 100;
  const fields = 'demographicItems segmentation evaluations indices';
  let filteredIds = [];

  const answersBatch = await EvaluationAnswersService.findBatchByEvaluationId(evaluationId, alreadyProcessedAnswersCount, chunkSize, fields);
  const answersBatchIds = answersBatch.map(x => x._id);

  const filters = {
    $or: []
  };

  for (const segment of criteria) {
    if (segment.type === 'demographic') {
      const demoFilters = {};
      demoFilters[`demographicItems.${segment.field}`] = { $ne: null };
      filters.$or.push(demoFilters);
    }

    if (segment.type === 'segmentation') {
      const segFilters = {
        $and: []
      };
      const tmpObj1 = {};
      tmpObj1['segmentation.segmentationId'] = segment.id;
      segFilters.$and.push(tmpObj1);
      const tmpObj2 = {};
      tmpObj2['segmentation.detailId'] = { $ne: -1 };
      segFilters.$and.push(tmpObj2);

      filters.$or.push(segFilters);
    }
  }
  const filteredAnswersBatch = await EvaluationAnswersService.findBatchByIdsAndFilterItems(answersBatchIds, filters, '_id');
  filteredIds = filteredAnswersBatch.map(x => x._id.toString());

  // Run Answers Dimension
  for (let i = 0; i < answersBatch.length; i++) {
    const isFiltered = filteredIds.includes(answersBatch[i]._id.toString());

    // Process ALL answers
    const temp = AnswersUtils.runAnswersDimension(
      answersBatch[i].evaluations,
      answersBatch[i].indices,
      answersDimension,
      indicesAnswers,
      isFiltered
    );
    answersDimension = temp.evaluations;
    indicesAnswers = temp.indices;

    // Process Segmented answers
    if (isFiltered) {
      // Participation belongs to segment, group it
      const tmp2 = SegmentsUtils.groupSegmentedAnswers(
        answersBatch[i],
        criteria,
        segmentedAnswers
      );
      segmentedAnswers = tmp2;
    }
  }

  return {
    processedAnswers: answersBatch.length,
    answersDimension,
    indicesAnswers,
    segmentedAnswers
  };
};
