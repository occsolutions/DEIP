
import { Response, Router } from 'express';
import  IRequest from './contracts/request';
import { catchAsyncError } from '../error';
import HttpSuperagentRequest from '../utils/http-superagent-request';

import EvaluatedService from '../services/evaluated.srvc';

const dictionary = {
  optionalDemo1: 'additionalDemographic1Ids',
  optionalDemo2: 'additionalDemographic2Ids',
  age: 'rangeAge',
  antiquity: 'rangeAntiquity',
  gender: 'genderId',
  charge: 'chargeIds',
  departments: 'departmentIds',
  jobTypes: 'jobTypeIds',
  country: 'countrySelect',
  headquarter: 'headquarterSelect',
  academicDegree: 'academicDegreeIds'
};

const ageItems = [
  { num: 1, id: [0, 25] },
  { num: 2, id: [25, 35] },
  { num: 3, id: [35, 45] },
  { num: 4, id: [45, 50] },
  { num: 5, id: [50, 200] }
];
const antiquityItems = [
  { num: 1, id: [0, 0.5] },
  { num: 2, id: [0.5, 1] },
  { num: 3, id: [1, 3] },
  { num: 4, id: [3, 5] },
  { num: 5, id: [5, 10] },
  { num: 6, id: [10, 20] },
  { num: 7, id: [20, 200] }
];

const sortBy = ((collection) => collection
  .sort((itemA, itemB) => {
    return itemA.translate && itemB.translate ?
      itemA.translate.label.localeCompare(itemB.translate.label) :
      itemA.name && itemB.name ? itemA.name.localeCompare(itemB.name) : false;
  })
  .map(x => {
    return {
      id: x.id,
      translations: x.translations ? x.translations : x.translate ? x.translate : x.name
    };
  })
);

const checkArray = (val) => {
  return Array.isArray(val) ? val : [val];
};

const getLabel = (lang, key, value) => {
  let label = '- - - -';
  if (['age', 'antiquity'].includes(key)) {
    label = `${key}.${value.num}`;
  } else {
    if (value.translations) {
      if (value.translations.label) {
        label = value.translations.label;
      } else {
        if (typeof value.translations === 'string') {
          label = value.translations;
        } else {
          label = value.translations.filter(t => t.lang === lang)[0].label;
        }
      }
    } else if (value.translate) {
      label = value.translate.label;
    }
  }
  return label;
};

const getSuiteEmployees = async (participants, filters, req) => {
  const totalFilteredEmployees = await HttpSuperagentRequest.sendRequest({
    product: 'suite',
    path: 'employees/by-ids-demographic-filter',
    method: 'POST',
    data: {
      ids: participants.map(x => x.indEmpEntId),
      filters: filters
    }
  }, req);
  const ids = totalFilteredEmployees.body.map(x => x.id);
  // Employees who completed the poll
  const filteredEmployeesCompleted = participants.filter(e => {
    return e.status === 'completed' && ids.includes(e.indEmpEntId);
  });

  return {
    total: ids.length,
    obtained: filteredEmployeesCompleted.length
  };
};

const getDemographicFromSuite = (code, req) => {
  const urlDictionary = {
    academicDegree: 'academic-degrees/list',
    charge: 'charges/list-by-enterprise',
    country: 'countries/list-by-enterprise',
    departments: 'departments/list',
    gender: 'genders/list-data',
    headquarter: 'headquarters/fetch-by-enterprise-for-headquarters-view',
    jobTypes: 'job-types/list',
    optionalDemo1: 'additional-demographics1/list-data',
    optionalDemo2: 'additional-demographics2/list-data'
  };

  return HttpSuperagentRequest.sendRequest({
    product: 'suite',
    path: urlDictionary[code],
    method: 'GET',
  }, req);
};


export default () => {
  const router = Router();

  router.post(
    '/:type/:id/get-results',
    catchAsyncError(async (req: IRequest, res: Response) => {
      const pollId = req.params.id;
      const lang = req.user && req.user.lang ? req.user.lang : 'es';
      const results: any = [];
      // Get Demographic IDs
      const totalItems: any = {};
      for (const code of req.body.codes) {
        switch (code) {
          case 'optionalDemo1':
            totalItems.optionalDemo1 = sortBy((await getDemographicFromSuite(code, req)).body.items);
            break;
          case 'optionalDemo2':
            totalItems.optionalDemo2 = sortBy((await getDemographicFromSuite(code, req)).body.items);
            break;
          case 'age':
            totalItems.age = ageItems;
            break;
          case 'antiquity':
            totalItems.antiquity = antiquityItems;
            break;
          case 'gender':
            totalItems.gender = sortBy((await getDemographicFromSuite(code, req)).body.items);
            break;
          case 'charge':
            totalItems.charge = sortBy((await getDemographicFromSuite(code, req)).body.items);
            break;
          case 'departments':
            totalItems.departments = sortBy((await getDemographicFromSuite(code, req)).body.items);
            break;
          case 'jobTypes':
            totalItems.jobTypes = sortBy((await getDemographicFromSuite(code, req)).body.items);
            break;
          case 'country':
            totalItems.country = sortBy((await getDemographicFromSuite(code, req)).body.items);
            break;
          case 'headquarter':
            totalItems.headquarter = sortBy((await getDemographicFromSuite(code, req)).body);
            break;
          case 'academicDegree':
            totalItems.academicDegree = sortBy((await getDemographicFromSuite(code, req)).body.items);
            break;
        }
      }

      // Get Assessment Population
      const ObjectID = require('mongodb').ObjectID;
      const objPollId = new ObjectID(pollId);
      const selectFields = '_id status indEmpEntId';
      const population: any = await EvaluatedService.getByEvaluationRef(objPollId, selectFields);

      // Assemble Results
      const wholes = {
        total: 0,
        obtained: 0
      };
      const key1 = req.body.codes[0];
      for (const value1 of totalItems[key1]) {
        const filters = {};
        const key2 = req.body.codes[1];
        if (key2) {
          for (const value2 of totalItems[key2]) {
            filters[dictionary[key1]] = checkArray(value1.id);
            filters[dictionary[key2]] = checkArray(value2.id);

            const totals = await getSuiteEmployees(population, filters, req);
            wholes.total += totals.total;
            wholes.obtained += totals.obtained;

            results.push({
              demo1: getLabel(lang, key1, value1),
              demo2: getLabel(lang, key2, value2),
              total: totals.total,
              obtained: totals.obtained
            });
          }
        } else {
          filters[dictionary[key1]] = checkArray(value1.id);

          const totals = await getSuiteEmployees(population, filters, req);
          wholes.total += totals.total;
          wholes.obtained += totals.obtained;

          results.push({
            demo1: getLabel(lang, key1, value1),
            total: totals.total,
            obtained: totals.obtained
          });
        }
      }

      res.send({results, wholes});
    })
  );

  return router;
};
