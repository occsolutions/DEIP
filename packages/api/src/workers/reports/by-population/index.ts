
import { default as OperationThreadsService } from '../../../services/operation-threads.srvc';

import AnswersUtils from './utils/answers';

import StepOne from './steps/01-segments';
import StepTwo from './steps/02-answers';
import StepThree from './steps/03-averages';

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
        case 1: // Get Segments
          const tempStepOne = await StepOne(
            threadData._evaluation,
            threadData.user,
            threadData.criteria[0]
          );

          if (!tempStepOne.success) {
            throw tempStepOne.error;
          } else {
            threadData.segments = tempStepOne.segments;
            threadData.segmentedAnswers = tempStepOne.segmentedInitAnswers;
            threadData.step = 2;
            threadData.progress = 30;
          }
          break;
        case 2: // Get Answers
          const tempStepTwo = await StepTwo(
            threadData._evaluation,
            threadData.tempData.alreadyProcessedAnswers,
            threadData.answersDimension,
            threadData.indicesAnswers,
            threadData.criteria,
            threadData.segmentedAnswers
          );

          threadData.tempData.alreadyProcessedAnswers += tempStepTwo.processedAnswers;
          threadData.answersDimension = tempStepTwo.answersDimension;
          threadData.indicesAnswers = tempStepTwo.indicesAnswers;
          threadData.segmentedAnswers = tempStepTwo.segmentedAnswers;

          if (threadData.answeredCount <= threadData.tempData.alreadyProcessedAnswers) {
            threadData.step = 3;
            threadData.progress = 75;
          }
          break;
        case 3: // Averages
          const tempStepThree = await StepThree(
            threadData.answersDimension,
            threadData.indicesAnswers,
            threadData.answeredCount,
            threadData.filteredAnswersCount,
            threadData.segmentedAnswers
          );

          threadData.answersDimension = tempStepThree.generalAverages.answersDimension;
          threadData.indicesAnswers = tempStepThree.generalAverages.indicesAnswers;
          threadData.segmentedAnswers = tempStepThree.segmentedAnswers;

          threadData.progress = 100;
          delete threadData.tempData;
          break;
      }

      const status = threadData.step === 3 && threadData.progress === 100 ? 'completed' : 'in_progress';

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
