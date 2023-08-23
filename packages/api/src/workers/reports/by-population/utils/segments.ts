
import RunHttpRequest from '../../../../utils/run-http-request';
import { default as EvaluationsService } from '../../../../services/evaluations.srvc';
import AnswersUtils from './answers';

const rangeItems = {
  age: [
    { id: 1, range: [0, 25], label: 'age_low' },
    { id: 2, range: [25, 35], label: 'age_range' },
    { id: 3, range: [35, 45], label: 'age_range' },
    { id: 4, range: [45, 50], label: 'age_range' },
    { id: 5, range: [50, 200], label: 'age_upper' }
  ],
  antiquity: [
    { id: 1, range: [0, 0.5], label: 'antiquity_low' },
    { id: 2, range: [0.5, 1], label: 'antiquity_range_single' },
    { id: 3, range: [1, 3], label: 'antiquity_range_one' },
    { id: 4, range: [3, 5], label: 'antiquity_range' },
    { id: 5, range: [5, 10], label: 'antiquity_range' },
    { id: 6, range: [10, 20], label: 'antiquity_range' },
    { id: 7, range: [20, 200], label: 'antiquity_upper' }
  ]
};

class SegmentsUtils {

  /**
   * @description Fetches demographic cuts fron Suite
   */
  public async getDemographics (user: any, code: string) {
    if (['age', 'antiquity'].includes(code)) {
      return {
        success: true,
        res: rangeItems[code],
        error: undefined
      };
    } else {
      const urlDictionary = {
        academicDegree: 'academic-degrees/list',
        charge: 'charges/list-by-enterprise',
        country: 'countries/list-by-enterprise',
        departments: 'departments/list',
        gender: 'genders/list-data',
        headquarter: 'headquarters/fetch-by-enterprise',
        jobTypes: 'job-types/list',
        optionalDemo1: 'additional-demographics1/list-data',
        optionalDemo2: 'additional-demographics2/list-data'
      };

      const enterprise = await RunHttpRequest.suiteGet(undefined, `enterprises/${user.enterprise.id}`);
      const req = {
        user: { ...user, enterprise }
      };

      return RunHttpRequest.suiteSilentGet(req, urlDictionary[code]);
    }
  }

  /**
   * @description Finds Segmentation Details
   */
  public async getSegmentations (evaluationId: any, user: any, code: string) {
    const resp = {
      success: false,
      res: [],
      error: undefined
    };

    const evaluation = await EvaluationsService.findById(evaluationId, 'additionalSegmentation');
    if (evaluation && evaluation.additionalSegmentation[code]) {
      resp.success = true;
      resp.res = evaluation.additionalSegmentation[code].details;
    }

    return resp;
  }

  /**
   * @description Initialize Segmented Answers
   */
  public async initSegmentedAnswers (segments: any) {
    const resp: any = {};

    for (const segment of segments) {
      resp[segment.id] = {
        count: 0,
        answersDimension: await AnswersUtils.iniAnswersDimension(),
        indicesAnswers: await AnswersUtils.iniIndicesAnswers()
      };
    }

    return resp;
  }

  /**
   * @description Group Segmented Answers
   */
  public groupSegmentedAnswers (
    participation: any,
    criteria: Array<any>,
    segmentedAnswers: any
  ) {

    for (const segmentId of Object.keys(segmentedAnswers)) {
      let belongs = false;
      if (criteria[0].type === 'demographic') {
        // demographicItems
        const field = criteria[0].field;
        if (['age', 'antiquity'].includes(criteria[0].code)) {
          const rng = rangeItems[criteria[0].code].find(x => x.id === Number(segmentId));
          const years = this.calcYears(participation.demographicItems[field]);
          belongs = years >= rng.range[0] && years < rng.range[1];
        } else {
          belongs = participation.demographicItems[field] === Number(segmentId);
        }
      } else {
        // segmentation
        const foundSegmentation = participation.segmentation.find(s => {
          return s.segmentationId === criteria[0].id && s.detailId === Number(segmentId);
        });
        if (foundSegmentation) {
          belongs = true;
        }
      }

      // Run Answers dimension
      if (belongs) {
        const temp = AnswersUtils.runAnswersDimension(
          participation.evaluations,
          participation.indices,
          segmentedAnswers[segmentId].answersDimension,
          segmentedAnswers[segmentId].indicesAnswers,
          true
        );
        segmentedAnswers[segmentId].count++;
        segmentedAnswers[segmentId].answersDimension = temp.evaluations;
        segmentedAnswers[segmentId].indicesAnswers = temp.indices;
        break;
      }
    }

    return segmentedAnswers;
  }

  private calcYears (date: any) {
    const init: any = new Date(date);
    const current: any = new Date();

    const month = current.getMonth();
    const day = current.getDate();
    const year = current.getFullYear();

    current.setDate(day);
    current.setMonth(month);
    current.setFullYear(year);

    const diffInMilliseconds = Math.abs(current - init);
    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const diffInYears = Math.abs(diffInDays / 365.25);

    return diffInYears;
  }

}

export default new SegmentsUtils();
