
import { IAnswersDimension, IScore } from '../contracts/answers-dimension';
import { IIndicesAnswers } from '../contracts/indices-answers';

class AveragesUtils {

  /**
   * @description Calculate dimensions & indices averages
   */
  public calcAverages (
    answersDimension: IAnswersDimension,
    indicesAnswers: IIndicesAnswers,
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

    // INDICES
    for (const indexKey of Object.keys(indicesAnswers)) {
      indicesAnswers[indexKey].general = this.getAverage(indicesAnswers[indexKey].general, total);
      indicesAnswers[indexKey].filtered = this.getAverage(indicesAnswers[indexKey].filtered, totalFiltered);

      // Answers
      const indexAnswers = indicesAnswers[indexKey].answers;
      for (const aKey of Object.keys(indexAnswers)) {
        indicesAnswers[indexKey].answers[aKey].general = this.getAverage(indicesAnswers[indexKey].answers[aKey].general, total);
        indicesAnswers[indexKey].answers[aKey].filtered = this.getAverage(indicesAnswers[indexKey].answers[aKey].filtered, totalFiltered);
      }
    }

    return {
      answersDimension,
      indicesAnswers
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
