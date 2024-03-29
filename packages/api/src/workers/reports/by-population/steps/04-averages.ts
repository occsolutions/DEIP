
import { IDimensionScatter } from '../contracts/scatter-dimension';
import { IAnswersDimension, IScore } from '../contracts/answers-dimension';

export default async (
  hasPrevious: boolean,
  answersForScatter: IDimensionScatter,
  answersDimension: IAnswersDimension,
  totalGeneralAnswers,
  totalFilteredAnswers,
  totalGeneralLeadersAnswers,
  totalFilteredLeadersAnswers,
  totalPreviousAnswers,
  totalFilteredPreviousAnswers
) => {

  const higherLower: any = [];

  const getAverage = (item: IScore, isFltrd: boolean, isLdr: boolean): IScore => {
    let ttl = isLdr ? totalGeneralLeadersAnswers : totalGeneralAnswers;

    if (isFltrd) {
      ttl = isLdr ? totalFilteredLeadersAnswers : totalFilteredAnswers;
    }

    item.score = (item.score / ttl);
    if (hasPrevious) {
      const ttl2 = isFltrd ? totalFilteredPreviousAnswers : totalPreviousAnswers;
      item.previous = (item.previous / ttl2);
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
    const avgForPreviousFilteredDim: Array<number> = [];
    if (dimKey !== 'leader') {
      // Attributes
      const dimAttributes = answersDimension[dimKey].attrs;
      for (const attrKey of Object.keys(dimAttributes)) {
        const avgForGeneralAttr: Array<number> = [];
        const avgForFilteredAttr: Array<number> = [];
        const avgForPreviousFilteredAttr: Array<number> = [];

        // Questions
        const attrQuestions = answersDimension[dimKey].attrs[attrKey].questions;
        for (const qKey of Object.keys(attrQuestions)) {
          const questionType = answersDimension[dimKey].attrs[attrKey].questions[qKey].qType;
          if (['closed', 'likert'].includes(questionType)) {
            // General Avg.
            const avg = getAverage(answersDimension[dimKey].attrs[attrKey].questions[qKey].general, false, false);
            answersDimension[dimKey].attrs[attrKey].questions[qKey].general = avg;
            answersForScatter[dimKey].attrs[attrKey].questions[qKey].general.scatter.average = arrAvg(answersForScatter[dimKey].attrs[attrKey].questions[qKey].general.scatter.scores);
            avgForGeneralAttr.push(avg.score);
            // Filtered Avg.
            const filteredAvg = getAverage(answersDimension[dimKey].attrs[attrKey].questions[qKey].filtered, true, false);
            answersDimension[dimKey].attrs[attrKey].questions[qKey].filtered = filteredAvg;
            answersForScatter[dimKey].attrs[attrKey].questions[qKey].filtered.scatter.average = arrAvg(answersForScatter[dimKey].attrs[attrKey].questions[qKey].filtered.scatter.scores);
            avgForFilteredAttr.push(filteredAvg.score);
            avgForPreviousFilteredAttr.push(filteredAvg.previous);
            // Directly get Dimension avg from questions, instead of Attributes
            avgForGeneralDim.push(avg.score);
            avgForFilteredDim.push(filteredAvg.score);
            avgForPreviousFilteredDim.push(filteredAvg.previous);

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
        /*
        avgForGeneralDim.push(attrGeneralAvg);
        */

        // Filtered Attribute Average
        const attrFilteredAvg = arrAvg(avgForFilteredAttr);
        answersDimension[dimKey].attrs[attrKey].filtered.score = attrFilteredAvg;
        /*
        avgForFilteredDim.push(attrFilteredAvg);
        */

        // Filtered Previous Attribute Average
        const attrPreviousFilteredAvg = arrAvg(avgForPreviousFilteredAttr);
        answersDimension[dimKey].attrs[attrKey].filtered.previous = attrPreviousFilteredAvg;
        /*
        avgForPreviousFilteredDim.push(attrPreviousFilteredAvg);
        */
        // As of 2024-03-24, Dimension avg is calculated straight from questions, not Attributes
      }
    } else {
      // Leader dimension
      for (const qKey of Object.keys(answersDimension[dimKey])) {
        if (!['general', 'filtered'].includes(qKey)) {
          const questionType = answersDimension[dimKey][qKey].qType;
          if (['closed', 'likert'].includes(questionType)) {
            // General Avg.
            const avg = getAverage(answersDimension[dimKey][qKey].general, false, true);
            answersDimension[dimKey][qKey].general = avg;
            answersForScatter[dimKey][qKey].general.scatter.average = arrAvg(answersForScatter[dimKey][qKey].general.scatter.scores);
            avgForGeneralDim.push(avg.score);
            // Filtered Avg.
            const filteredAvg = getAverage(answersDimension[dimKey][qKey].filtered, true, true);
            answersDimension[dimKey][qKey].filtered = filteredAvg;
            answersForScatter[dimKey][qKey].filtered.scatter.average = arrAvg(answersForScatter[dimKey][qKey].filtered.scatter.scores);
            avgForFilteredDim.push(filteredAvg.score);
            avgForPreviousFilteredDim.push(filteredAvg.previous);
            // For ranking, based on filtered avg.
            if (totalFilteredLeadersAnswers) {
              higherLower.push({
                type: questionType,
                dimension: dimKey,
                question: qKey,
                score: filteredAvg.score
              });
            }
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
    answersDimension[dimKey].filtered.previous = arrAvg(avgForPreviousFilteredDim);
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
