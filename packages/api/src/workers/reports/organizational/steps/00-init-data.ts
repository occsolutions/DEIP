
import AnswersUtils from '../utils/answers';

export default async () => {
  return {
    answersForScatter: await AnswersUtils.iniAnswersForScatter(),
    answersDimension: await AnswersUtils.iniAnswersDimension(),
    indicesAnswers: await AnswersUtils.iniIndicesAnswers(),
    openAnswers: await AnswersUtils.iniOpenAnswers()
  };
};
