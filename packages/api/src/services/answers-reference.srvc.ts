
import { AnswersReference } from '../models/answers-reference';
import AnswersReferenceRepository, { AnswersReferenceType } from '../schemas/answers-reference.schema';

class AnswersReferenceService {

  async create(answersReference: AnswersReference): Promise<AnswersReference|AnswersReferenceType> {
    return (await new AnswersReferenceRepository(answersReference).save());
  }

  async update(answersReference: AnswersReference): Promise<AnswersReference|AnswersReferenceType> {
    return AnswersReferenceRepository.updateOne(
      { idx: answersReference.idx },
      answersReference
    );
  }

  async list(): Promise<AnswersReference[]|AnswersReferenceType[]> {
    return AnswersReferenceRepository.find();
  }

}

export default new AnswersReferenceService();
