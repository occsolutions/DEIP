
import { OpenQuestion } from '../models/open-question';
import OpenQuestionRepository, { OpenQuestionType } from '../schemas/open-question.schema';

/**
 * @class OpenQuestionService
 */
class OpenQuestionService {

  /**
   * @description Saves the question in the storage
   * @param {OpenQuestion} openQuestion
   * @returns {Promise<OpenQuestion>}
   */
  async create(openQuestion: OpenQuestion): Promise<OpenQuestion|OpenQuestionType> {
    return (await new OpenQuestionRepository(openQuestion).save());
  }

  /**
   * @description Fetches all open question from the storage
   * @returns {Promise<OpenQuestion[]>}
   */
  async findAll(): Promise<OpenQuestion[]|OpenQuestionType[]> {
    return OpenQuestionRepository.find();
  }

  /**
   * @description Fetches single question service by id and updates it
   * @param {OpenQuestion} openQuestion
   * @returns {Promise<OpenQuestion>}
   */
  async findOneByNameAndUpdate(openQuestion: OpenQuestion): Promise<OpenQuestion|OpenQuestionType> {
    return OpenQuestionRepository.updateOne(
      { name: openQuestion.name },
      openQuestion
    );
  }

}

export default new OpenQuestionService();
