
import { IAnswersDimension } from '../contracts/answers-dimension';
import { IIndicesAnswers } from '../contracts/indices-answers';

const dimensionNames = ['physical', 'mental', 'emotional', 'professional'];
const indexNames = ['generalHealth', 'burnoutIndividual', 'burnoutOrganizational'];

class AnswersUtils {

  // Questionnaire Answers Initializer
  public iniAnswersDimension (): IAnswersDimension {
    const getInitScore = () => ({ score: 0 });
    const getInitQuestion = () => ({
      name: '',
      general: getInitScore(),
      filtered: getInitScore()
    });
    const getInitVariable = () => ({
      name: '',
      general: getInitScore(),
      filtered: getInitScore(),
      questions: {
        question_1: getInitQuestion(),
        question_2: getInitQuestion(),
        question_3: getInitQuestion(),
        question_4: getInitQuestion()
      }
    });
    const getInitDimension = () => ({
      general: getInitScore(),
      filtered: getInitScore(),
      variables: {
        var_1: getInitVariable(),
        var_2: getInitVariable(),
        var_3: getInitVariable()
      }
    });

    return {
      physical: getInitDimension(),
      mental: getInitDimension(),
      emotional: getInitDimension(),
      professional: getInitDimension()
    };
  }

  // Indices Answers Initializer
  public iniIndicesAnswers (): IIndicesAnswers {
    const getInitScore = () => ({ score: 0 });
    const getInitIndexAnswer = () => ({
      idx: 0,
      general: getInitScore(),
      filtered: getInitScore()
    });
    const getInitIndex = () => ({
      general: getInitScore(),
      filtered: getInitScore(),
      answers: {
        answer_1: getInitIndexAnswer(),
        answer_2: getInitIndexAnswer(),
        answer_3: getInitIndexAnswer(),
        answer_4: getInitIndexAnswer(),
        answer_5: getInitIndexAnswer(),
        answer_6: getInitIndexAnswer()
      }
    });

    return {
      generalHealth: getInitIndex(),
      burnoutIndividual: getInitIndex(),
      burnoutOrganizational: getInitIndex()
    };
  }

  public runAnswersDimension (
    answers: Array<any>,
    indices: Array<any>,
    answersDimension: IAnswersDimension,
    indicesAnswers: IIndicesAnswers,
    isFiltered: boolean
  ) {
    // EVALUATIONS
    // Dimensions
    for (let d = 0; d < 4; d++) {
      const dimKey = dimensionNames[d];
      const dimScore = answers[d].score;
      answersDimension[dimKey].general.score += dimScore;
      if (isFiltered) {
        answersDimension[dimKey].filtered.score += dimScore;
      }

      // Variables
      for (let v = 0; v < 3; v++) {
        const varScore = answers[d].variables[v].score;
        answersDimension[dimKey].variables[`var_${v + 1}`].name = answers[d].variables[v].name;
        answersDimension[dimKey].variables[`var_${v + 1}`].general.score += varScore;
        if (isFiltered) {
          answersDimension[dimKey].variables[`var_${v + 1}`].filtered.score += varScore;
        }

        // Questions
        for (let q = 0; q < 4; q++) {
          const qName = answers[d].variables[v].questions[q].name;
          const qScore = answers[d].variables[v].questions[q].score;
          answersDimension[dimKey].variables[`var_${v + 1}`].questions[`question_${q + 1}`].name = qName;
          answersDimension[dimKey].variables[`var_${v + 1}`].questions[`question_${q + 1}`].general.score += qScore;
          if (isFiltered) {
            answersDimension[dimKey].variables[`var_${v + 1}`].questions[`question_${q + 1}`].filtered.score += qScore;
          }
        }
      }
    }

    // INDICES
    for (const index of indexNames) {
      const found = indices.find(x => x.name === index);
      indicesAnswers[index].general.score += found.score;
      if (isFiltered) {
        indicesAnswers[index].filtered.score += found.score;
      }

      // Answers
      for (let a = 0; a < 6; a++) {
        const answr = found.answers[a];
        indicesAnswers[index].answers[`answer_${a + 1}`].idx = answr.idx;
        indicesAnswers[index].answers[`answer_${a + 1}`].general.score += answr.score;
        if (isFiltered) {
          indicesAnswers[index].answers[`answer_${a + 1}`].filtered.score += answr.score;
        }
      }
    }

    return {
      evaluations: answersDimension,
      indices: indicesAnswers
    };
  }
}

export default new AnswersUtils();
