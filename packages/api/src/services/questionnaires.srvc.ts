
import { Questionnaire } from '../models/questionnaire';
import QuestionnaireRepository, { QuestionnairesType } from '../schemas/questionnaires.schema';

/**
 * @class QuestionnaireService
 */
class QuestionnaireService {

  /**
   * @description Fetches all questionnaires
   * @returns {Promise<Questionnaire[]>}
   */
  async list(): Promise<Questionnaire[]> {
    return await QuestionnaireRepository.find({ deletedAt: undefined }) as Questionnaire[];
  }

  /**
   * @description Fetches filtered questionnaires from the storage
   * @returns {Promise<Questionnaire[]>}
   */
  async filtered(customerId: number, enterpriseId: number, sectorId: number): Promise<Questionnaire[]> {
    return QuestionnaireRepository.find({ $and: [
      {'active': true},
      { $or: [
          {'assignationType': ''},
          {'assignationType': 'enterprise', 'assignationFor': enterpriseId},
          {'assignationType': 'customer', 'assignationFor': customerId},
          {'assignationType': 'sector', 'assignationFor': sectorId}
        ]
      }]
    });
  }

  async save(questionnaire: Questionnaire): Promise<Questionnaire> {
    return (await new QuestionnaireRepository(questionnaire).save()).toObject({ virtuals: true });
  }

  async deleteOne(slug: string): Promise<QuestionnairesType> {
    return await QuestionnaireRepository.findOneAndUpdate({ slug: slug }, { active: false, deletedAt: new Date() }, { new: true });
    // return await QuestionnaireRepository.deleteOne({ name: name });
  }

  async findOneBySlug(slug: string): Promise<Questionnaire> {
    const questionnaire: QuestionnairesType = await QuestionnaireRepository.findOne({ slug });
    return questionnaire;
  }

  async update(slug: string, questionnaire: Questionnaire): Promise<Questionnaire> {
    const response: Questionnaire = await QuestionnaireRepository.findOneAndUpdate({ slug: slug }, { evaluations: questionnaire.evaluations }, { new: true});
    return response;
  }

  async updateQuestionnaireInfo(slug: string, questionnaire: Questionnaire): Promise<Questionnaire> {
    const assignation = {
      type: '',
      for: undefined
    };

    if (questionnaire.assignationType) {
      assignation.type = questionnaire.assignationType;
      assignation.for = questionnaire.assignationFor;
    }
    const response: Questionnaire = await QuestionnaireRepository.findOneAndUpdate({slug: slug}, {
      name: questionnaire.name,
      assignationType: assignation.type,
      assignationFor: assignation.for
    }, { new: true });
    return response;
  }

  async toggle(slug: string, active: boolean): Promise<Questionnaire> {
    const questionnaire: Questionnaire = await QuestionnaireRepository.findOneAndUpdate({ slug: slug }, { active: active }, { new: true });
    return questionnaire;
  }
}

export default new QuestionnaireService();