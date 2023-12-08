
import { IAnswersDimension, IScore } from '../contracts/answers-dimension';

class AveragesUtils {

  /**
   * @description Calculate dimensions
   */
  public calcAverages (
    answersDimension: IAnswersDimension,
    total: number,
    totalFiltered: number
  ) {
    // Dimensions
    for (const dimKey of Object.keys(answersDimension)) {
      answersDimension[dimKey].general = this.getAverage(answersDimension[dimKey].general, total);
      answersDimension[dimKey].filtered = this.getAverage(answersDimension[dimKey].filtered, totalFiltered);

      if (dimKey !== 'leader') {
        // Attributes
        const dimAttributes = answersDimension[dimKey].attrs;
        for (const attrKey of Object.keys(dimAttributes)) {
          answersDimension[dimKey].attrs[attrKey].general = this.getAverage(answersDimension[dimKey].attrs[attrKey].general, total);
          answersDimension[dimKey].attrs[attrKey].filtered = this.getAverage(answersDimension[dimKey].attrs[attrKey].filtered, totalFiltered);

          // Questions
          const attrQuestions = answersDimension[dimKey].attrs[attrKey].questions;
          for (const qKey of Object.keys(attrQuestions)) {
            const gralAvg = this.getAverage(answersDimension[dimKey].attrs[attrKey].questions[qKey].general, total);
            const filtAvg = this.getAverage(answersDimension[dimKey].attrs[attrKey].questions[qKey].filtered, totalFiltered);
            answersDimension[dimKey].attrs[attrKey].questions[qKey].general = gralAvg;
            answersDimension[dimKey].attrs[attrKey].questions[qKey].filtered = filtAvg;
          }
        }
      } else {
        // Questions
        for (const qKey of Object.keys(answersDimension[dimKey])) {
          if (!['general', 'filtered'].includes(qKey)) {
            const gralAvg = this.getAverage(answersDimension[dimKey][qKey].general, total);
            const filtAvg = this.getAverage(answersDimension[dimKey][qKey].filtered, totalFiltered);
            answersDimension[dimKey][qKey].general = gralAvg;
            answersDimension[dimKey][qKey].filtered = filtAvg;
          }
        }
      }
    }

    return {
      answersDimension
    };
  }

  private getAverage (item: IScore, total: number): IScore {
    if (total) {
      item.score = (item.score / total);
    }
    return JSON.parse(JSON.stringify(item.score));
  }

}

export default new AveragesUtils();
