
import { IAnswersDimension } from '../contracts/answers-dimension';
import AveragesUtils from '../utils/averages';

export default async (
  answersDimension: IAnswersDimension,
  totalAnswers,
  totalFilteredAnswers,
  segmentedAnswers
) => {

  // General Averages
  const generalAverages = await AveragesUtils.calcAverages(
    answersDimension,
    totalAnswers,
    totalFilteredAnswers
  );

  // Segmented Averages
  for (const segmentId of Object.keys(segmentedAnswers)) {
    const cnt = segmentedAnswers[segmentId].count;
    const segmentAverages = await AveragesUtils.calcAverages(
      segmentedAnswers[segmentId].answersDimension,
      cnt,
      cnt
    );
    segmentedAnswers[segmentId] = {
      count: cnt,
      answersDimension: segmentAverages.answersDimension
    };
  }

  return {
    generalAverages,
    segmentedAnswers
  };
};
