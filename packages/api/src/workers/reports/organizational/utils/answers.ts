
import { IDimensionScatter } from '../contracts/scatter-dimension';
import { IAnswersDimension } from '../contracts/answers-dimension';

const dimensionNames = ['physical', 'mental', 'emotional', 'professional'];

class AnswersUtils {

  // Answers for Scatter Initializer
  public iniAnswersForScatter (): IDimensionScatter {
    const getInitScatter = () => ({ average: 0, scores: [] });
    const getInitVariable = () => ({
      questions: {
        question_1: {
          scatter: getInitScatter()
        },
        question_2: {
          scatter: getInitScatter()
        },
        question_3: {
          scatter: getInitScatter()
        },
        question_4: {
          scatter: getInitScatter()
        }
      }
    });
    const getInitDimension = () => ({
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

  // Questionnaire Answers Initializer
  public iniAnswersDimension (): IAnswersDimension {
    const getInitScore = () => ({ score: 0, previous: 0 });
    const getInitQuestion = () => ({ name: '', general: getInitScore() });
    const getInitVariable = () => ({
      name: '',
      general: getInitScore(),
      questions: {
        question_1: getInitQuestion(),
        question_2: getInitQuestion(),
        question_3: getInitQuestion(),
        question_4: getInitQuestion()
      }
    });
    const getInitDimension = () => ({
      general: getInitScore(),
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

  public runAnswersDimension (
    answers: Array<any>,
    answersForScatter: IDimensionScatter,
    answersDimension: IAnswersDimension,
    previous: boolean
  ) {
    const dynamicKey = previous ? 'previous' : 'score';

    // EVALUATIONS
    // Dimensions
    for (let d = 0; d < 4; d++) {
      const dimKey = dimensionNames[d];
      const dimScore = answers[d].score;
      answersDimension[dimKey].general[dynamicKey] += dimScore;

      // Variables
      for (let v = 0; v < 3; v++) {
        const varScore = answers[d].variables[v].score;
        answersDimension[dimKey].variables[`var_${v + 1}`].name = answers[d].variables[v].name;
        answersDimension[dimKey].variables[`var_${v + 1}`].general[dynamicKey] += varScore;

        // Questions
        for (let q = 0; q < 4; q++) {
          const qName = answers[d].variables[v].questions[q].name;
          const qScore = answers[d].variables[v].questions[q].score;
          answersDimension[dimKey].variables[`var_${v + 1}`].questions[`question_${q + 1}`].name = qName;
          answersDimension[dimKey].variables[`var_${v + 1}`].questions[`question_${q + 1}`].general[dynamicKey] += qScore;
          if (!previous) {
            answersForScatter[dimKey].variables[`var_${v + 1}`].questions[`question_${q + 1}`].scatter.scores.push(qScore);
          }
        }
      }
    }

    return {
      scatter: answersForScatter,
      evaluations: answersDimension
    };
  }
}

export default new AnswersUtils();
