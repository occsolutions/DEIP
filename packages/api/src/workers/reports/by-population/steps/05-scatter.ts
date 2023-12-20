
import { IDimensionScatter } from '../contracts/scatter-dimension';
import AnswersUtils from '../utils/answers';

export default async (
  answersForScatter: IDimensionScatter
) => {
  // Init final Scatter structure
  const scatterDimension = await AnswersUtils.iniAnswersForScatter(true);

  const getScatter = (scores: Array<number>, media: number, isFltrd: boolean) => {
    let distanceSum = 0;
    for (const score of scores) {
      distanceSum += Math.pow(score - media, 2);
    }
    // Samples must divide by (scores.length - 1)
    const ttl = isFltrd ? scores.length - 1 : scores.length;
    if (ttl === 0) {
      return 0;
    }
    return Math.sqrt(distanceSum / ttl);
  };

  const higherLower: any = [];

  // Dimensions
  for (const dimKey of Object.keys(answersForScatter)) {
    if (dimKey !== 'leader') {
      // Attributes
      const dimAttributes = answersForScatter[dimKey].attrs;
      for (const attrKey of Object.keys(dimAttributes)) {
        // Questions
        const attrQuestions = answersForScatter[dimKey].attrs[attrKey].questions;
        for (const qKey of Object.keys(attrQuestions)) {
          for (const type of ['general', 'filtered']) {
            const scatterData = answersForScatter[dimKey].attrs[attrKey].questions[qKey][type].scatter;
            const scores = scatterData.scores;
            if (scores.length) {
              const media = scatterData.average;
              const scatter = await getScatter(scores, media, type === 'filtered');
              scatterDimension[dimKey].attrs[attrKey].questions[qKey][type].scatter = scatter;
              if (type === 'filtered') {
                higherLower.push({
                  dimension: dimKey,
                  attribute: attrKey,
                  question: qKey,
                  scatter
                });
              }
            }
          }
        }
      }
    } else {
      for (const qKey of Object.keys(answersForScatter[dimKey])) {
        for (const type of ['general', 'filtered']) {
          const scatterData = answersForScatter[dimKey][qKey][type].scatter;
          const scores = scatterData.scores;
          if (scores.length) {
            const media = scatterData.average;
            const scatter = await getScatter(scores, media, type === 'filtered');
            scatterDimension[dimKey][qKey][type].scatter = scatter;
            if (type === 'filtered') {
              higherLower.push({
                dimension: dimKey,
                question: qKey,
                scatter
              });
            }
          }
        }
      }
    }
  }

  const highest = higherLower.sort((a, b) => b.scatter - a.scatter).slice(0, 6);
  const lowest = higherLower.sort((a, b) => a.scatter - b.scatter).slice(0, 6);

  return {
    scatter: scatterDimension,
    highest,
    lowest
  };
};
