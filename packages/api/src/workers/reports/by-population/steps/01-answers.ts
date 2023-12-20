
import { default as EvaluatedService } from '../../../../services/evaluated.srvc';

import { IDimensionScatter } from '../contracts/scatter-dimension';
import { IAnswersDimension } from '../contracts/answers-dimension';

import AnswersUtils from '../utils/answers';

const demographicIds = {
  academicDegrees: 'academicDegreeId',
  additionalDemographics1: 'additionalDemographic1Id',
  additionalDemographics2: 'additionalDemographic2Id',
  charges: 'chargeId',
  countries: 'countryId',
  departments: 'departmentId',
  headquarters: 'headquarterId',
  jobTypes: 'jobTypeId'
};

const calcDates = (rng1, rng2) => {
  const dateOne = new Date();
  const dateTwo = new Date();
  dateOne.setHours(0, 0, 0, 0);
  dateTwo.setHours(0, 0, 0, 0);
  dateOne.setMonth(dateOne.getMonth() - rng1 * 12);
  dateTwo.setMonth(dateTwo.getMonth() - rng2 * 12);

  return { dateOne, dateTwo };
};

export default async (
  evaluationId: string,
  alreadyProcessedAnswersCount: number,
  answersForScatter: IDimensionScatter,
  answersDimension: IAnswersDimension,
  populationLeaders: Array<number>,
  criteria: any,
  answersRateDetails: any,
  demoFilters: any
) => {
  const chunkSize = 100;
  const fields = 'indEmpEntId temp.evaluations temp.segmentation employee.employeeEnterprise';
  const answersBatch: any = await EvaluatedService.findByBatchByEvaluationIdAndStatusCompleted(evaluationId, alreadyProcessedAnswersCount, chunkSize, fields);
  const filtered: any = await EvaluatedService.findCompletedByEvaluationIdAndFilterItems(evaluationId, demoFilters, 'indEmpEntId');

  // Run Answers Dimension
  for (let i = 0; i < answersBatch.length; i++) {
    const isFiltered = filtered.map(x => x.indEmpEntId).includes(answersBatch[i].indEmpEntId);
    const temp = await AnswersUtils.runAnswersDimension(
      answersBatch[i].temp.evaluations,
      answersForScatter,
      answersDimension,
      populationLeaders.includes(answersBatch[i].indEmpEntId),
      isFiltered,
      false
    );
    answersForScatter = temp.scatter;
    answersDimension = temp.evaluations;

    // Answers rate details
    if (isFiltered) {
      for (const key in criteria) {
        switch (key) {
          case 'age':
            const ageDates = calcDates(criteria[key][0], criteria[key][1]);
            const birthdate = new Date(answersBatch[i].employee.employeeEnterprise.birthdate);
            if (birthdate >= ageDates.dateTwo && birthdate < ageDates.dateOne) {
              answersRateDetails[key][`${criteria[key][0]}-${criteria[key][1]}`]++;
            }
            break;
          case 'antiquity':
            const antiquityDates = calcDates(criteria[key][0], criteria[key][1]);
            const admission = new Date(answersBatch[i].employee.employeeEnterprise.admission);
            if (admission >= antiquityDates.dateTwo && admission < antiquityDates.dateOne) {
              answersRateDetails[key][`${criteria[key][0]}-${criteria[key][1]}`]++;
            }
            break;
          case 'genders':
            if (answersBatch[i].employee.employeeEnterprise.genderId === criteria[key]) {
              answersRateDetails[key][criteria[key]]++;
            }
            break;
          default:
            if (!key.startsWith('segmentation')) {
              for (const demoId of criteria[key]) {
                if (answersBatch[i].employee.employeeEnterprise[demographicIds[key]] === demoId) {
                  answersRateDetails[key][demoId]++;
                }
              }
            } else {
              const segmentationId = parseInt(key.replace(/[^0-9]/g, ''));
              for (const detailId of criteria[key]) {
                const found = answersBatch[i].temp.segmentation.find(x => x.segmentationId === segmentationId && x.detailId === detailId);
                if (found) {
                  answersRateDetails[key][detailId]++;
                }
              }
            }
            break;
        }
      }
    }
  }

  return {
    processedAnswers: answersBatch.length,
    answersRateDetails,
    answersForScatter,
    answersDimension
  };
};
