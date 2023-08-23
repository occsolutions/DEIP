
import AnswersUtils from '../utils/answers';

export default async () => {
  return {
    answersDimension: await AnswersUtils.iniAnswersDimension(),
    indicesAnswers: await AnswersUtils.iniIndicesAnswers(),
    segments: [],
    segmentedAnswers: {}
  };
};
