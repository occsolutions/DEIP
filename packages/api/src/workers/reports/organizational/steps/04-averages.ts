
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

  const arrAvg = (arr: Array<number>): number => {
    if (!arr.length) return 0;
    return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
  };

  // Dimensions
  for (const dimKey of Object.keys(answersDimension)) {
    const avgForDim: Array<number> = [];
    if (dimKey !== 'leader') {
      // Attributes
      const dimAttributes = answersDimension[dimKey].attrs;
      for (const attrKey of Object.keys(dimAttributes)) {
        const avgForAttr: Array<number> = [];

        // Questions
        const attrQuestions = answersDimension[dimKey].attrs[attrKey].questions;
        for (const qKey of Object.keys(attrQuestions)) {
          const questionType = answersDimension[dimKey].attrs[attrKey].questions[qKey].qType;
          if (['closed', 'likert'].includes(questionType)) {
            const avg = getAverage(answersDimension[dimKey].attrs[attrKey].questions[qKey].general);
            answersDimension[dimKey].attrs[attrKey].questions[qKey].general = avg;
            higherLower.push({
              type: questionType,
              dimension: dimKey,
              attribute: attrKey,
              question: qKey,
              score: avg.score
            });
            answersForScatter[dimKey].attrs[attrKey].questions[qKey].scatter.average = avg.score;
            avgForAttr.push(avg.score);
          } else {
            const counts = {};
            const arr = answersDimension[dimKey].attrs[attrKey].questions[qKey].general.scores;
            for (let i = 0; i < arr.length; i++) {
              counts[arr[i]] = 1 + (counts[arr[i]] || 0);
            }
            answersDimension[dimKey].attrs[attrKey].questions[qKey].general.scores = [counts];
          }
        }

        // Attribute Average
        const attrAvg = arrAvg(avgForAttr);
        answersDimension[dimKey].attrs[attrKey].general.score = attrAvg;
        avgForDim.push(attrAvg);
      }
    } else {
      for (const qKey of Object.keys(answersDimension[dimKey])) {
        if (!['general', 'filtered'].includes(qKey)) {
          const questionType = answersDimension[dimKey][qKey].qType;
          if (['closed', 'likert'].includes(questionType)) {
            const avg = getAverage(answersDimension[dimKey][qKey].general);
            answersDimension[dimKey][qKey].general = avg;
            higherLower.push({
              type: questionType,
              dimension: dimKey,
              question: qKey,
              score: avg.score
            });
            answersForScatter[dimKey][qKey].scatter.average = avg.score;
            avgForDim.push(avg.score);
          } else {
            const counts = {};
            const arr = answersDimension[dimKey][qKey].general.scores;
            for (let i = 0; i < arr.length; i++) {
              counts[arr[i]] = 1 + (counts[arr[i]] || 0);
            }
            answersDimension[dimKey][qKey].general.scores = [counts];
          }
        }
      }
    }

    // Dimension Average
    answersDimension[dimKey].general.score = arrAvg(avgForDim);
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
