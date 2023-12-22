
import { IDimensionScatter } from '../contracts/scatter-dimension';
import AnswersUtils from '../utils/answers';

export default async (
  answersForScatter: IDimensionScatter
) => {
  // Init final Scatter structure
  const scatterDimension = await AnswersUtils.iniAnswersForScatter(true);

  const getScatter = (scores: Array<number>, media: number) => {
    let distanceSum = 0;
    for (const score of scores) {
      distanceSum += Math.pow(score - media, 2);
    }
    if (!scores.length) {
      return 0;
    }
    return Math.sqrt(distanceSum / scores.length);
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
          // Current
          const scatterData = answersForScatter[dimKey].attrs[attrKey].questions[qKey].scatter;
          const scores = scatterData.scores;
          if (scores.length) {
            const media = scatterData.average;
            const scatter = getScatter(scores, media);

            higherLower.push({
              dimension: dimKey,
              attribute: attrKey,
              question: qKey,
              scatter
            });

            scatterDimension[dimKey].attrs[attrKey].questions[qKey].scatter = scatter;
          }

          // Previous
          const scatterPreviousData = answersForScatter[dimKey].attrs[attrKey].questions[qKey].previous;
          const scoresPrevious = scatterPreviousData.scores;
          if (scoresPrevious.length) {
            const media = scatterPreviousData.average;
            const scatterPrevious = getScatter(scoresPrevious, media);
            scatterDimension[dimKey].attrs[attrKey].questions[qKey].previous = scatterPrevious;
          }
        }
      }
    } else {
      for (const qKey of Object.keys(answersForScatter[dimKey])) {
        // Current
        const scatterData = answersForScatter[dimKey][qKey].scatter;
        const scores = scatterData.scores;
        if (scores.length) {
          const media = scatterData.average;
          const scatter = getScatter(scores, media);

          higherLower.push({
            dimension: dimKey,
            question: qKey,
            scatter
          });

          scatterDimension[dimKey][qKey].scatter = scatter;
        }

        // Previous
        const scatterPreviousData = answersForScatter[dimKey][qKey].previous;
        const scoresPrevious = scatterPreviousData.scores;
        if (scoresPrevious.length) {
          const media = scatterPreviousData.average;
          const scatterPrevious = getScatter(scoresPrevious, media);
          scatterDimension[dimKey][qKey].previous = scatterPrevious;
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
