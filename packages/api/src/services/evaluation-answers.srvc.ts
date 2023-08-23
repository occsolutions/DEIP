
import { ObjectID } from 'mongodb';
import { EvaluationAnswers } from '../models/evaluation-answers';
import EvaluationAnswersRepository from '../schemas/evaluation-answers.schema';

/**
 * @class EvaluationAnswersService
 */
class EvaluationAnswersService {

  /**
   * @description Save evaluation's answers in the collection
   * @param {EvaluationAnswers} assessment
   * @returns {Promise<EvaluationAnswers>}
   */
  async save(answers: EvaluationAnswers): Promise<EvaluationAnswers> {
    return new EvaluationAnswersRepository(answers).save();
  }

  /**
   * @description Get batch of answers in an evaluation
   * @param {any} evaluationId
   * @returns {Promise<EvaluationAnswers[]>}
   */
  async findByBatchByEvaluationId(evaluationId: any, skip: number, qty: number, select?: undefined|any): Promise<EvaluationAnswers[]> {
    return EvaluationAnswersRepository.find(
      { evaluationRef: evaluationId },
      select || undefined,
      { skip: Number(skip * qty), limit: Number(qty) }
    );
  }

  /**
   * @description Find batch of evaluation's answers
   * @param {any} evaluationId
   * @returns {Promise<EvaluationAnswers[]>}
   */
  async findBatchByEvaluationId(evaluationId: any, skip: number, qty: number, select?: undefined|any): Promise<EvaluationAnswers[]> {
    return EvaluationAnswersRepository.find(
      { evaluationRef: evaluationId },
      select || undefined,
      { skip: skip, limit: qty }
    );
  }

  /**
   * @description Get batch of answers in an evaluation
   * @param {any} evaluationId
   * @returns {Promise<EvaluationAnswers[]>}
   */
  async findByBatchByEvaluationIdAndFilterItems(
    evaluationId: any,
    filter: {[key: string]: Array<any>},
    // filter: {[key: string]: {$in: Array<number>}},
    skip: number,
    qty: number,
    select?: undefined|any): Promise<EvaluationAnswers[]> {
    return EvaluationAnswersRepository.find(
      { evaluationRef: new ObjectID(evaluationId), ...filter },
      select || undefined,
      { skip: Number(skip), limit: Number(qty) }
    );
  }

  /**
   * @description Get evaluations answers by IDs & filters
   * @returns {Promise<EvaluationAnswers[]>}
   */
  async findBatchByIdsAndFilterItems(
    ids: any,
    filter: {[key: string]: Array<any>},
    select?: undefined|any): Promise<EvaluationAnswers[]> {
    return EvaluationAnswersRepository.find(
      { _id: { $in: ids }, ...filter },
      select || undefined
    );
  }

  /**
   * @description Get all participants in an evaluation
   * @param {any} evaluationId
   * @returns {Promise<EvaluationAnswers[]>}
   */
  async findManyByEvaluationId(evaluationId: any, select?: undefined|any): Promise<EvaluationAnswers[]> {
    return EvaluationAnswersRepository.find({evaluationRef: evaluationId}, select || undefined);
  }

  /**
   * @description Get all participants in an evaluation
   * @param {any} evaluationId
   * @returns {Promise<EvaluationAnswers[]>}
   */
  async findOneByEvaluationId(evaluationId: any, select?: undefined|any): Promise<EvaluationAnswers> {
    return EvaluationAnswersRepository.findOne({evaluationRef: evaluationId}, select || undefined);
  }

  /**
   * @description Count answers in an evaluation
   * @param {any} evaluationId
   * @returns {Promise<EvaluationAnswers[]>}
   */
  async countByEvaluationId(evaluationId: any): Promise<number> {
    return EvaluationAnswersRepository.countDocuments({
      evaluationRef: new ObjectID(evaluationId)
    }, (err, result) => result);
  }

  /**
   * @description Count answers in an evaluation
   * @param {any} evaluationId
   * @returns {Promise<EvaluationAnswers[]>}
   */
  async countByEvaluationIdAndFilterItems(evaluationId: any, filter): Promise<number> {
    return EvaluationAnswersRepository.countDocuments({
      evaluationRef: new ObjectID(evaluationId), ...filter
    }, (err, result) => result);
  }

  /**
   * @description Find a participant's answers in an evaluation
   * @param {any} evaluationId
   * @returns {Promise<EvaluationAnswers[]>}
   */
  async findOneByPopulationId(evaluationId: any, populationId: any, select?: undefined|any): Promise<EvaluationAnswers> {
    return EvaluationAnswersRepository.findOne(
      {
        evaluationRef: evaluationId,
        _populationId: populationId
      },
      select || undefined
    );
  }

  /**
   * @description Find Additional Question's answers in an evaluation
   * @param {string} value
   * @returns {Promise<EvaluationAnswers[]>}
   */
  async findByQuestion(evaluationId: any, value: string): Promise<any> {
    return EvaluationAnswersRepository.find(
      // Filter
      {
        evaluationRef: new ObjectID(evaluationId),
        'additionalQuestions.question': value
      },
      // Select
      {
        _id: 0,
        'additionalQuestions': {$elemMatch: {question: value}}
      }
    );
  }
}

export default new EvaluationAnswersService();
