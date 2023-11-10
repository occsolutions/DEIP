
import { IDimensionScatter } from '../contracts/scatter-dimension';
import { IAnswersDimension, IScore } from '../contracts/answers-dimension';

export default async (
  hasPrevious: boolean,
  answersForScatter: IDimensionScatter,
  answersDimension: IAnswersDimension,
  totalAnswers,
  totalPreviousAnswers
) => {

  const higherLower: any = [];

  const getAverage = (item: IScore): IScore => {
    item.score = (item.score / totalAnswers);
    if (hasPrevious) {
      item.previous = (item.previous / totalPreviousAnswers);
    }
    return JSON.parse(JSON.stringify(item));
  };

  // Dimensions
  for (const dimKey of Object.keys(answersDimension)) {
    answersDimension[dimKey].general = getAverage(answersDimension[dimKey].general);

    // Variables
    const dimVariables = answersDimension[dimKey].variables;
    for (const varKey of Object.keys(dimVariables)) {
      answersDimension[dimKey].variables[varKey].general = getAverage(answersDimension[dimKey].variables[varKey].general);

      // Questions
      const varQuestions = answersDimension[dimKey].variables[varKey].questions;
      for (const qKey of Object.keys(varQuestions)) {
        const avg = getAverage(answersDimension[dimKey].variables[varKey].questions[qKey].general);
        answersDimension[dimKey].variables[varKey].questions[qKey].general = avg;
        higherLower.push({
          type: 'evaluations',
          dimension: dimKey,
          attribute: varKey,
          question: qKey,
          score: answersDimension[dimKey].variables[varKey].questions[qKey].general.score
        });
        answersForScatter[dimKey].variables[varKey].questions[qKey].scatter.average = avg.score;
      }
    }
  }

  const highest = higherLower.sort((a, b) => b.score - a.score).slice(0, 6);
  const lowest = higherLower.sort((a, b) => a.score - b.score).slice(0, 6);

  return {
    answersForScatter,
    answersDimension,
    highest,
    lowest
  };
};
