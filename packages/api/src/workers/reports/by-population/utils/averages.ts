
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

      // Variables
      const dimVariables = answersDimension[dimKey].variables;
      for (const varKey of Object.keys(dimVariables)) {
        answersDimension[dimKey].variables[varKey].general = this.getAverage(answersDimension[dimKey].variables[varKey].general, total);
        answersDimension[dimKey].variables[varKey].filtered = this.getAverage(answersDimension[dimKey].variables[varKey].filtered, totalFiltered);

        // Questions
        const varQuestions = answersDimension[dimKey].variables[varKey].questions;
        for (const qKey of Object.keys(varQuestions)) {
          const gralAvg = this.getAverage(answersDimension[dimKey].variables[varKey].questions[qKey].general, total);
          const filtAvg = this.getAverage(answersDimension[dimKey].variables[varKey].questions[qKey].filtered, totalFiltered);
          answersDimension[dimKey].variables[varKey].questions[qKey].general = gralAvg;
          answersDimension[dimKey].variables[varKey].questions[qKey].filtered = filtAvg;
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
