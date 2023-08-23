
import { IAnswersDimension } from '../contracts/answers-dimension';
import { IIndicesAnswers } from '../contracts/indices-answers';
import AveragesUtils from '../utils/averages';

export default async (
  answersDimension: IAnswersDimension,
  indicesAnswers: IIndicesAnswers,
  totalAnswers,
  totalFilteredAnswers,
  segmentedAnswers
) => {

  // General Averages
  const generalAverages = await AveragesUtils.calcAverages(
    answersDimension,
    indicesAnswers,
    totalAnswers,
    totalFilteredAnswers
  );

  // Segmented Averages
  for (const segmentId of Object.keys(segmentedAnswers)) {
    const cnt = segmentedAnswers[segmentId].count;
    const segmentAverages = await AveragesUtils.calcAverages(
      segmentedAnswers[segmentId].answersDimension,
      segmentedAnswers[segmentId].indicesAnswers,
      cnt,
      cnt
    );
    segmentedAnswers[segmentId] = {
      count: cnt,
      answersDimension: segmentAverages.answersDimension,
      indicesAnswers: segmentAverages.indicesAnswers
    };
  }

  return {
    generalAverages,
    segmentedAnswers
  };
};
