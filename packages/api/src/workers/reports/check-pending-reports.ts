
import { default as OperationThreadsService } from '../../services/operation-threads.srvc';
import { default as EvaluationsService } from '../../services/evaluations.srvc';

import InitOrganizational from './organizational/steps/00-init-data';
import InitByPopulation from './by-population/steps/00-init-data';

class ReportChecker {

  /**
   * @description Checks if there are report requests pending for generation & sets initial data
   * @returns {string}
   */
  public async checkReportRequests() {
    const pendingOperationThread = await OperationThreadsService.findByOperationAndStatus(
      'DownloadReport',
      'pending'
    );
    if (!pendingOperationThread) {
      return;
    }
    await OperationThreadsService.findOneAndUpdateStatus(pendingOperationThread._id, 'in_action');

    const threadData = pendingOperationThread.data;
    threadData.step = 1;
    threadData.progress = 10;

    const evaluation: any = await EvaluationsService.findById(threadData._evaluation, 'populationLeaders');
    threadData.populationLeaders = evaluation ? evaluation.populationLeaders : [];

    switch (threadData.type) {
      case 'organizational':
        const initOrganizational = await InitOrganizational();
        threadData.answersForScatter = initOrganizational.answersForScatter;
        threadData.answersDimension = initOrganizational.answersDimension;

        threadData.tempData = {
          alreadyProcessedAnswers: 0,
          previous: {
            alreadyProcessedAnswers: 0,
            answeredCount: 0
          }
        };
        break;
      case 'by_demographic':
        const initByPopulation = await InitByPopulation(threadData.criteria);
        threadData.answersDimension = initByPopulation.answersDimension;
        threadData.answersForScatter = initByPopulation.answersForScatter;
        threadData.answersRateDetails = initByPopulation.rates;
        threadData.tempData = {
          alreadyProcessedAnswers: 0,
          previous: {
            alreadyProcessedAnswers: 0,
            answeredCount: 0
          },
          filterString: JSON.stringify(initByPopulation.filterString)
        };
        break;
    }

    await OperationThreadsService.findOneAndUpdateStatusData(pendingOperationThread._id, 'in_progress', threadData);

    return pendingOperationThread._id;
  }

}

export default new ReportChecker();
