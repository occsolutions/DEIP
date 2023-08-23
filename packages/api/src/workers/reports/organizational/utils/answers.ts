
import { IDimensionScatter } from '../contracts/scatter-dimension';
import { IAnswersDimension } from '../contracts/answers-dimension';
import { IIndicesAnswers } from '../contracts/indices-answers';
import { IOpenAnswers } from '../contracts/open-answers';

const dimensionNames = ['physical', 'mental', 'emotional', 'professional'];
const indexNames = ['generalHealth', 'burnoutIndividual', 'burnoutOrganizational'];
const openQuestionNames = ['openQuestion1', 'openQuestion2'];

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

  // Indices Answers Initializer
  public iniIndicesAnswers (): IIndicesAnswers {
    const getInitScore = () => ({ score: 0, previous: 0 });
    const getInitIndexAnswer = () => ({
      idx: 0,
      general: getInitScore()
    });
    const getInitIndex = () => ({
      general: getInitScore(),
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

  // Open Questions' Answers Initializer
  public iniOpenAnswers (): IOpenAnswers {
    const getInitOpen = () => ({
      answers: []
    });

    return {
      openQuestion1: getInitOpen(),
      openQuestion2: getInitOpen()
    };
  }

  public runAnswersDimension (
    answers: Array<any>,
    indices: Array<any>,
    opens: Array<any>,
    answersForScatter: IDimensionScatter,
    answersDimension: IAnswersDimension,
    indicesAnswers: IIndicesAnswers,
    openAnswers: IOpenAnswers,
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

    // INDICES
    for (const index of indexNames) {
      const found = indices.find(x => x.name === index);
      indicesAnswers[index].general[dynamicKey] += found.score;

      // Answers
      for (let a = 0; a < 6; a++) {
        const answr = found.answers[a];
        indicesAnswers[index].answers[`answer_${a + 1}`].idx = answr.idx;
        indicesAnswers[index].answers[`answer_${a + 1}`].general[dynamicKey] += answr.score;
      }
    }

    // OPENS
    if (!previous) {
      let cnt = 0;
      for (const opn of openQuestionNames) {
        openAnswers[opn].answers.push(...opens[cnt].answer);
        cnt++;
      }
    }

    return {
      scatter: answersForScatter,
      evaluations: answersDimension,
      indices: indicesAnswers,
      open: openAnswers
    };
  }
}

export default new AnswersUtils();
