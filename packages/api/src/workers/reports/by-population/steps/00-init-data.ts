
import AnswersUtils from '../utils/answers';

export default async () => {
  return {
    answersDimension: await AnswersUtils.iniAnswersDimension(),
    segments: [],
    segmentedAnswers: {}
  };
};
