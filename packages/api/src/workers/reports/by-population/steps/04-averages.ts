
import { IDimensionScatter } from '../contracts/scatter-dimension';
import { IAnswersDimension, IScore } from '../contracts/answers-dimension';

export default async (
  hasPrevious: boolean,
  answersForScatter: IDimensionScatter,
  answersDimension: IAnswersDimension,
  totalGeneralAnswers,
  totalFilteredAnswers,
  totalPreviousAnswers
) => {

  const higherLower: any = [];

  const getAverage = (item: IScore, isFltrd: boolean): IScore => {
    const ttl = isFltrd ? totalFilteredAnswers : totalGeneralAnswers;
    item.score = (item.score / ttl);
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
    const avgForGeneralDim: Array<number> = [];
    const avgForFilteredDim: Array<number> = [];
    if (dimKey !== 'leader') {
      // Attributes
      const dimAttributes = answersDimension[dimKey].attrs;
      for (const attrKey of Object.keys(dimAttributes)) {
        const avgForGeneralAttr: Array<number> = [];
        const avgForFilteredAttr: Array<number> = [];

        // Questions
        const attrQuestions = answersDimension[dimKey].attrs[attrKey].questions;
        for (const qKey of Object.keys(attrQuestions)) {
          const questionType = answersDimension[dimKey].attrs[attrKey].questions[qKey].qType;
          if (['closed', 'likert'].includes(questionType)) {
            // General Avg.
            const avg = getAverage(answersDimension[dimKey].attrs[attrKey].questions[qKey].general, false);
            answersDimension[dimKey].attrs[attrKey].questions[qKey].general = avg;
            answersForScatter[dimKey].attrs[attrKey].questions[qKey].general.scatter.average = avg.score;
            avgForGeneralAttr.push(avg.score);
            // Filtered Avg.
            const filteredAvg = getAverage(answersDimension[dimKey].attrs[attrKey].questions[qKey].filtered, true);
            answersDimension[dimKey].attrs[attrKey].questions[qKey].filtered = filteredAvg;
            answersForScatter[dimKey].attrs[attrKey].questions[qKey].filtered.scatter.average = filteredAvg.score;
            avgForFilteredAttr.push(filteredAvg.score);
            // For ranking, based on filtered avg.
            higherLower.push({
              type: questionType,
              dimension: dimKey,
              attribute: attrKey,
              question: qKey,
              score: filteredAvg.score
            });
          } else {
            // General
            const gCounts = {};
            const gArr = answersDimension[dimKey].attrs[attrKey].questions[qKey].general.scores;
            for (let i = 0; i < gArr.length; i++) {
              gCounts[gArr[i]] = 1 + (gCounts[gArr[i]] || 0);
            }
            answersDimension[dimKey].attrs[attrKey].questions[qKey].general.scores = [gCounts];

            // Filtered
            const fCounts = {};
            const fArr = answersDimension[dimKey].attrs[attrKey].questions[qKey].filtered.scores;
            for (let i = 0; i < fArr.length; i++) {
              fCounts[fArr[i]] = 1 + (fCounts[fArr[i]] || 0);
            }
            answersDimension[dimKey].attrs[attrKey].questions[qKey].filtered.scores = [fCounts];
          }
        }

        // General Attribute Average
        const attrGeneralAvg = arrAvg(avgForGeneralAttr);
        answersDimension[dimKey].attrs[attrKey].general.score = attrGeneralAvg;
        avgForGeneralDim.push(attrGeneralAvg);
        // Filtered Attribute Average
        const attrFilteredAvg = arrAvg(avgForFilteredAttr);
        answersDimension[dimKey].attrs[attrKey].filtered.score = attrFilteredAvg;
        avgForFilteredDim.push(attrFilteredAvg);
      }
    } else {
      for (const qKey of Object.keys(answersDimension[dimKey])) {
        if (!['general', 'filtered'].includes(qKey)) {
          const questionType = answersDimension[dimKey][qKey].qType;
          if (['closed', 'likert'].includes(questionType)) {
            // General Avg.
            const avg = getAverage(answersDimension[dimKey][qKey].general, false);
            answersDimension[dimKey][qKey].general = avg;
            answersForScatter[dimKey][qKey].general.scatter.average = avg.score;
            avgForGeneralDim.push(avg.score);
            // Filtered Avg.
            const filteredAvg = getAverage(answersDimension[dimKey][qKey].filtered, true);
            answersDimension[dimKey][qKey].filtered = filteredAvg;
            answersForScatter[dimKey][qKey].filtered.scatter.average = filteredAvg.score;
            avgForFilteredDim.push(filteredAvg.score);
            // For ranking, based on filtered avg.
            higherLower.push({
              type: questionType,
              dimension: dimKey,
              question: qKey,
              score: filteredAvg.score
            });
          } else {
            // General
            const gCounts = {};
            const gArr = answersDimension[dimKey][qKey].general.scores;
            for (let i = 0; i < gArr.length; i++) {
              gCounts[gArr[i]] = 1 + (gCounts[gArr[i]] || 0);
            }
            answersDimension[dimKey][qKey].general.scores = [gCounts];
            // Filtered
            const fCounts = {};
            const fArr = answersDimension[dimKey][qKey].filtered.scores;
            for (let i = 0; i < fArr.length; i++) {
              fCounts[fArr[i]] = 1 + (fCounts[fArr[i]] || 0);
            }
            answersDimension[dimKey][qKey].filtered.scores = [fCounts];
          }
        }
      }
    }

    // General Dimension Average
    answersDimension[dimKey].general.score = arrAvg(avgForGeneralDim);
    // Filtered Dimension Average
    answersDimension[dimKey].filtered.score = arrAvg(avgForFilteredDim);
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
