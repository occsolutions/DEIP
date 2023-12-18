
import AnswersUtils from '../utils/answers';

export default async (criteria) => {
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

  const filterString: any = {
    $and: []
  };

  for (const key of Object.keys(criteria)) {
    const demoFilters: any = {};
    switch (key) {
      case 'age':
        const ageDates = calcDates(criteria[key][0], criteria[key][1]);
        demoFilters['employee.employeeEnterprise.birthdate'] = {
          $gte: ageDates.dateTwo.toISOString().slice(0, 10),
          $lt: ageDates.dateOne.toISOString().slice(0, 10)
        };
        break;
      case 'antiquity':
        const antiquityDates = calcDates(criteria[key][0], criteria[key][1]);
        demoFilters['employee.employeeEnterprise.admission'] = {
          $gte: antiquityDates.dateTwo.toISOString().slice(0, 10),
          $lt: antiquityDates.dateOne.toISOString().slice(0, 10)
        };
        break;
      case 'genders':
        demoFilters['employee.employeeEnterprise.genderId'] = { $in: [criteria[key]] };
        break;
      default:
        if (!key.startsWith('segmentation')) {
          demoFilters[`employee.employeeEnterprise.${demographicIds[key]}`] = { $in: criteria[key] };
        } else {
          // Filter by Additional Segmentation
          const segmentationId = parseInt(key.replace(/[^0-9]/g, ''));
          demoFilters['temp.segmentation.segmentationId'] = { $in: [segmentationId] };
          demoFilters['temp.segmentation.detailId'] = { $in: criteria[key] };
        }
        break;
    }
    filterString.$and.push(demoFilters);
  }

  return {
    answersForScatter: await AnswersUtils.iniAnswersForScatter(),
    answersDimension: await AnswersUtils.iniAnswersDimension(),
    filterString
  };
};
