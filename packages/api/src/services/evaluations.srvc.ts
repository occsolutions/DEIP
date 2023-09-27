
import { ObjectID } from 'mongodb';
import { Evaluation } from '../models/evaluation';
import EvaluationRepository from '../schemas/evaluation.schema';

import ProductServiceService from './product-service.srvc';
import RunHttpRequest from '../utils/run-http-request';

/**
 * @class QuestionnaireService
 */
class EvaluationsService {

  /**
   * @description Fetches all questionnaires
   * @returns {Promise<Questionnaire[]>}
   */
  async listAll(filters: object = {}, select?: undefined|any): Promise<Evaluation[]> {
    return EvaluationRepository.find(filters, select || undefined).sort({'createdAt': -1});
  }

  async listByEnterprise(enterpriseId: number, filters: object = {}, select?: undefined|any): Promise<Evaluation[]> {
    return EvaluationRepository.find({ enterpriseId: enterpriseId, ...filters }, select || undefined).sort({'createdAt': -1});
  }

  async create(evaluation: Evaluation): Promise<Evaluation> {
    return (await new EvaluationRepository(evaluation).save()).toObject({ virtuals: true });
  }

  async findOneBySlug(slug: string, select?: string): Promise<Evaluation|null> {
    return EvaluationRepository.findOne({ slug }, select || undefined);
  }

  async findById(id: string, select?: undefined|any): Promise<Evaluation|null> {
    return EvaluationRepository.findOne({_id: new ObjectID(id)}, select || undefined);
  }

  async findInProgressById(id: string, select?: undefined|any): Promise<Evaluation|null> {
    return EvaluationRepository.findOne({
      _id: new ObjectID(id),
      status: 'in_progress'
    }, select || undefined);
  }

  async updateBySlug(slug: string, evaluation: Evaluation): Promise<Evaluation|null> {
    return EvaluationRepository.findOneAndUpdate({ slug: slug }, {...evaluation}, { new: true });
  }

  async updateCustomEmailReleaseBySlug(slug: string, evaluation: Evaluation): Promise<Evaluation|null> {
    return EvaluationRepository.findOneAndUpdate(
      { slug: slug },
      { customEmailRelease: evaluation.customEmailRelease },
      { new: true }
    );
  }

  async updateCustomEmailReminderBySlug(slug: string, evaluation: Evaluation): Promise<Evaluation|null> {
    return EvaluationRepository.findOneAndUpdate(
      { slug: slug },
      { customEmailReminder: evaluation.customEmailReminder, reminders: evaluation.reminders },
      { new: true }
    );
  }

  async filterByStatus(status: string) {
    return EvaluationRepository.find({ status });
  }

  async updateReminders(id: string, reminders: any): Promise<Evaluation|null> {
    return EvaluationRepository.findByIdAndUpdate(new ObjectID(id), {
      reminders: reminders
    });
  }

  async updateStatus(status: string, data: any): Promise<any> {
    return EvaluationRepository.updateMany(
      { _id: { $in: data } },
      { status: status }
    );
  }

  async updateEvaluatedCount(id: string, count: number): Promise<Evaluation|null> {
    return EvaluationRepository.findByIdAndUpdate(
      new ObjectID(id),
      { populationCount: count });
  }

  async closeEvaluation(slug: string): Promise<Evaluation|null> {
    return EvaluationRepository.findOneAndUpdate({ slug }, { status: 'completed' });
  }

  async closeEvaluationById(id: any): Promise<Evaluation|null> {
    return EvaluationRepository.findOneAndUpdate({ _id: new ObjectID(id) }, { status: 'completed' });
  }

  async findManyById(ids: Array<string>): Promise<Evaluation[]> {
    return EvaluationRepository.find({_id: {$in: ids}});
  }

  async listByStartDate(): Promise<Evaluation[]> {
    return EvaluationRepository.find({}, 'slug displayName name deliveredAt validUntil status enterprise.name enterprise.customer.name populationCount').sort({ deliveredAt: 'desc' }).limit(10);
  }

  async listByEnterpriseOrderByStartDate(enterpriseId: number): Promise<Evaluation[]> {
    return EvaluationRepository.find({ enterpriseId: enterpriseId }, 'slug name status');
  }

  /**
   * @description Find a previous evaluation
   * @returns {Promise<void>}
   */
  async findOnePrevious(id: string, enterpriseId: number, questionnaire: any, deliveredAt: any, select?: undefined|any): Promise<Evaluation|null> {
    return EvaluationRepository.findOne({
      _id: { $ne: new ObjectID(id) },
      enterpriseId: enterpriseId,
      status: 'completed',
      deliveredAt: { $lt: deliveredAt },
      'questionnaire._id': questionnaire._id,
      'questionnaire.updatedAt': questionnaire.updatedAt
    }, select || undefined)
    .sort({'deliveredAt': -1});
  }

  /**
   * @description Update an evaluation's answered polls count
   * @returns {Promise<void>}
   */
  async updateAnsweredCount(id: string, populationCompletedCount: number): Promise<Evaluation|null> {
    return EvaluationRepository.findByIdAndUpdate(new ObjectID(id), {
      populationCompletedCount
    });
  }

  /**
   * @description Updates Suite Activity for a given Evaluation
   * @returns {Promise<Evaluation[]>}
   */
  async updateSuiteActivity(evaluation: Evaluation, status: string) {
    let resp;
    try {
      const productService = await ProductServiceService.findByName('MEDICIÓN DEIP');
      resp = await RunHttpRequest.suitePost(undefined, 'activities/deip-individual/update-status', {
        evaluation: {
          enterpriseId: evaluation.enterpriseId,
          status: status,
          _id: evaluation._id
        },
        productService
      });
    } catch (error) {
      console.log('activities/deip-individual/update-status', error);
      resp = error;
    }

    return resp;
  }
}

export default new EvaluationsService();
