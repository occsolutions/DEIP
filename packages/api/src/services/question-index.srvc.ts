
import { QuestionsIndex } from '../models/question-index';
import QuestionsIndexRepository, { QuestionsIndexType } from '../schemas/question-index.schema';

class QuestionsIndexService {

  async create(questionIndex: QuestionsIndex): Promise<QuestionsIndex> {
    return (await new QuestionsIndexRepository(questionIndex).save());
  }

  async update(questionIndex: QuestionsIndex): Promise<QuestionsIndex> {
    return QuestionsIndexRepository.updateOne(
      { idx: questionIndex.idx },
      questionIndex
    );
  }

  async listByIndexGroup(indexGroup: string, select?: undefined|any): Promise<QuestionsIndexType[]> {
    return QuestionsIndexRepository.find(
      { index: indexGroup },
      select || undefined
    );
  }

}

export default new QuestionsIndexService();
