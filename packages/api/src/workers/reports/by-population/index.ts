
import { default as OperationThreadsService } from '../../../services/operation-threads.srvc';

import StepOne from './steps/01-answers';
import StepTwo from './steps/02-previous';
import StepThree from './steps/03-previous-answers';
import StepFour from './steps/04-averages';
import StepFive from './steps/05-scatter';

class ReportMethods {

  /**
   * @description Runs result processing for a report
   * @returns {object}
   */
  public async processReportResults() {
    const pendingOperationThread = await OperationThreadsService.findByOperationStatusAndDataType(
      'DownloadReport',
      'in_progress',
      'by_demographic'
    );
    if (!pendingOperationThread) {
      return;
    }

    const threadData = pendingOperationThread.data;

    try {
      await OperationThreadsService.findOneAndUpdateStatus(pendingOperationThread._id, 'in_action');

      switch (threadData.step) {
        case 1: // Get Answers
          const tempStepOne = await StepOne(
            threadData._evaluation,
            threadData.tempData.alreadyProcessedAnswers,
            threadData.answersForScatter,
            threadData.answersDimension,
            threadData.populationLeaders,
            threadData.criteria,
            threadData.answersRateDetails,
            JSON.parse(threadData.tempData.filterString)
          );

          threadData.tempData.alreadyProcessedAnswers += tempStepOne.processedAnswers;
          threadData.answersRateDetails = tempStepOne.answersRateDetails;
          threadData.answersForScatter = tempStepOne.answersForScatter;
          threadData.answersDimension = tempStepOne.answersDimension;

          if (threadData.answeredCount <= threadData.tempData.alreadyProcessedAnswers) {
            threadData.step = 2;
            threadData.progress = 30;
          }
          break;
        case 2: // Get Previous
          const tempStepTwo = await StepTwo(
            threadData._evaluation,
            threadData.enterpriseId,
            JSON.parse(threadData.tempData.filterString)
          );

          if (!tempStepTwo.previous) {
            threadData.hasPrevious = false;
            threadData.step = 4;
            threadData.progress = 60;
          } else {
            threadData.hasPrevious = true;
            threadData.previous = tempStepTwo.previous;
            threadData.tempData.previous = {
              answeredCount: tempStepTwo.answerCount,
              filteredAnsweredCount: tempStepTwo.filteredAnswerCount,
              alreadyProcessedAnswers: 0
            };
            threadData.step = 3;
            threadData.progress = 40;
          }
          break;
        case 3: // Get Previous Answers
          const tempStepThree = await StepThree(
            threadData.previous._id,
            threadData.tempData.previous.alreadyProcessedAnswers,
            threadData.answersForScatter,
            threadData.answersDimension,
            threadData.populationLeaders,
            JSON.parse(threadData.tempData.filterString)
          );

          threadData.tempData.previous.alreadyProcessedAnswers += tempStepThree.processedAnswers;
          threadData.answersDimension = tempStepThree.answersDimension;

          if (threadData.tempData.previous.answeredCount <= threadData.tempData.previous.alreadyProcessedAnswers) {
            threadData.step = 4;
            threadData.progress = 60;
          }
          break;
        case 4: // Averages
          const tempStepFour = await StepFour(
            threadData.hasPrevious,
            threadData.answersForScatter,
            threadData.answersDimension,
            threadData.answeredCount,
            threadData.filteredAnswersCount,
            threadData.answeredLeadersCount,
            threadData.filteredLeadersAnswersCount,
            threadData.hasPrevious ? threadData.tempData.previous.answeredCount : 1,
            threadData.hasPrevious ? threadData.tempData.previous.filteredAnsweredCount : 1
          );

          threadData.answersForScatter = tempStepFour.answersForScatter;
          threadData.answersDimension = tempStepFour.answersDimension;
          threadData.highestScores = tempStepFour.highest;
          threadData.lowestScores = tempStepFour.lowest;

          threadData.step = 5;
          threadData.progress = 80;
          break;
        case 5: // Scatter
          const tempStepFive = await StepFive(
            threadData.answersForScatter
          );

          threadData.scatterDimension = tempStepFive.scatter;
          threadData.highestScatter = tempStepFive.highest;
          threadData.lowestScatter = tempStepFive.lowest;

          threadData.progress = 100;

          delete threadData.tempData;
          break;
      }

      const status = threadData.progress === 100 ? 'completed' : 'in_progress';

      await OperationThreadsService.findOneAndUpdateStatusData(pendingOperationThread._id, status, threadData);

    } catch (error) {
      return await this.saveFailed(pendingOperationThread._id, 'Process Report Results Error', {
        step: threadData.step,
        error: error.stack ? error.stack : error.toString()
      });
    }

    return pendingOperationThread._id;
  }

  private async saveFailed (_id: string, type: string, data: {[key: string]: any}) {
    await OperationThreadsService.findOneAndSaveFail(_id, { type, ...data});
    return `failed by: ${type}`;
  }

}

export default new ReportMethods();
