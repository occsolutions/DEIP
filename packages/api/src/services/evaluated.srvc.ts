
import { ObjectID } from 'mongodb';
import { Evaluated } from '../models/evaluated';
import EvaluatedRepository, { EvaluatedType } from '../schemas/evaluated.schema';

class EvaluatedService {

  async create(evaluated: Evaluated): Promise<Evaluated> {
    return (await new EvaluatedRepository(evaluated).save());
  }

  async save(populations: Array<Evaluated>): Promise<Evaluated[]> {
    return EvaluatedRepository.insertMany(populations);
  }

  async excludeBatch(evaluationRef: any, populationIds: Array<any>) {
    return EvaluatedRepository.updateMany({
      evaluationRef: new ObjectID(evaluationRef),
      _id: { $in: populationIds }
    }, {
      $set: { status: 'excluded', employee: undefined }
    });
  }

  async deleteOne(evaluationRef: any, populations: any) {
    return EvaluatedRepository.deleteOne({ evaluationRef: new ObjectID(evaluationRef), _id: new ObjectID(populations) }, () => {});
  }

  async deleteBatch(evaluationRef: any, populationIds: Array<any>) {
    return EvaluatedRepository.deleteMany({
      evaluationRef: new ObjectID(evaluationRef),
      _id: { $in: populationIds }
    });
  }

  async findOneCompletedByEvaluationRefAndId(evaluationRef: any, id: any): Promise<EvaluatedType|null> {
    return EvaluatedRepository.findOne({
      _id: new ObjectID(id),
      evaluationRef: new ObjectID(evaluationRef),
      status: 'completed'
    });
  }

  async getByEvaluationRefAndStatus(evaluationRef: any, status: Array<string>, select?: string|undefined): Promise<EvaluatedType[]> {
    return EvaluatedRepository.find({
      evaluationRef: new ObjectID(evaluationRef),
      status: {$in: status}
    }, select);
  }

  async getAtLeastOneActiveParticipant(evaluationRef: any): Promise<EvaluatedType|null> {
    return EvaluatedRepository.findOne({
      evaluationRef: new ObjectID(evaluationRef),
      status: {$in: ['pending', 'in_progress']}
    });
  }

  async countByEvaluationRef(evaluationRef: any): Promise<number> {
    return EvaluatedRepository.countDocuments({ evaluationRef: new ObjectID(evaluationRef), status: { $ne : 'excluded'}  });
  }

  async countCompletedByEvaluationRef(evaluationRef: any): Promise<number> {
    return EvaluatedRepository.countDocuments({
      evaluationRef: new ObjectID(evaluationRef),
      status: 'completed'
    });
  }

  async getByEvaluationRef(evaluationRef: any, select?: string|undefined): Promise<EvaluatedType[]> {
    return EvaluatedRepository.find({ evaluationRef: new ObjectID(evaluationRef), status: { $ne : 'excluded'} }, select);
  }

  async getByEvaluationRefWithTotalCount(evaluationRef: any, filter: {}, search: string, skip: number, qty: number): Promise<{ total: number, items: EvaluatedType[] }>  {
    const query: any = [
      {
        $addFields: {
          fullName: {
            $concat: [
              '$employee.employeeEnterprise.firstName',
              ' ',
              '$employee.employeeEnterprise.lastName',
            ]
          }
        }
      },
      {
        $match: {
          evaluationRef: new ObjectID(evaluationRef),
          status: {
            $ne: 'excluded'
          }
        }
      },
      {
        $project: {
          'status': 1,
          'employee.employeeEnterprise.firstName': 1,
          'employee.employeeEnterprise.lastName': 1,
          'fullName': 1
        }
      },
    ];
    if (filter) {
      query[1]['$match']['status']['$eq'] = filter;
    }
    if (search) {
      query.push({
        $match: {
          fullName: {
            $regex: search,
            $options: 'i'
          }
        }
      });
    }
    const items = await EvaluatedRepository.aggregate([...query, { $skip: Number(skip * qty) }, { $limit: Number(qty) }]);
    const [ count ] = await EvaluatedRepository.aggregate([...query, { $count: 'total'}]);
    return { total: count.total, items };
  }

  async getOneByToken(token: string, select?: string|undefined): Promise<EvaluatedType|null> {
    return EvaluatedRepository.findOne({ token }, select);
  }

  async findManyByEmployeeId(employeeId: number, select?: undefined|any): Promise<EvaluatedType[]> {
    return EvaluatedRepository.find({'employee.id': employeeId, 'status': { $nin: ['completed', 'excluded']} }, select || undefined);
  }

  async findManyByEmployeeEnterpriseId(employeeEnterpriseId: number, select?: undefined|any): Promise<EvaluatedType[]> {
    return EvaluatedRepository.find({'indEmpEntId': employeeEnterpriseId, 'status': { $nin: ['completed', 'excluded']} }, select || undefined);
  }

  async findBatchByEvaluationRefAndEmployeeEnterpriseIds(evaluationRef: any, employeeEnterpriseIds: Array<number>, skip: number, qty: number, select?: undefined|any): Promise<EvaluatedType[]> {
    return EvaluatedRepository.find(
      {
        evaluationRef: new ObjectID(evaluationRef),
        'indEmpEntId': { $in: employeeEnterpriseIds },
        'status': { $nin: ['completed', 'excluded']}
      },
      select || undefined,
      { skip: Number(skip * qty), limit: Number(qty) }
    );
  }

  async getEvaluationBaseToken(evaluationRef: any): Promise<EvaluatedType|null> {
    return EvaluatedRepository.findOne({
      evaluationRef: new ObjectID(evaluationRef),
      'status': { $nin: ['excluded']}
    }, 'baseToken');
  }

  async findByBatchByEvaluationId(evaluationId: any, skip: number, qty: number, select?: undefined|any): Promise<EvaluatedType[]> {
    return EvaluatedRepository.find(
      { evaluationRef: evaluationId },
      select || undefined,
      { skip: Number(skip * qty), limit: Number(qty) }
    );
  }

  async findByBatchByEvaluationIdByItems(evaluationId: any, filter, skip: number, qty: number, select?: undefined|any): Promise<EvaluatedType[]> {
    return EvaluatedRepository.find(
      { evaluationRef: evaluationId, ...filter },
      select || undefined,
      { skip: Number(skip * qty), limit: Number(qty) }
    );
  }

  async findAdditionalByQuestion(evaluationId: any, value: string): Promise<any> {
    return EvaluatedRepository.aggregate([
      {
        $match: {
          $and: [
            { evaluationRef: new ObjectID(evaluationId) },
            { 'temp.additional.question': value }
          ]
        }
      },
      { $unwind: '$temp' },
      { $unwind: '$temp.additional' },
      {
        $match: {
          'temp.additional.question': value
        }
      },
      {
        $replaceRoot: {
          newRoot: '$temp.additional'
        }
      }
    ]);
  }

  async setPolicyAccepted(tokenId: string, url: string): Promise<EvaluatedType|null> {
    const data = {
      accepted: true,
      timestamp: Date.now(),
      url: url
    };
    return EvaluatedRepository.findOneAndUpdate(
      {'token': tokenId},
      { '$set': { 'sensitiveDataTreatmentPolicyAccepted': data }},
      { new: true}
    );
  }

  async updateTempAnswers(tokenId: string, temp: any): Promise<EvaluatedType|null> {
    return EvaluatedRepository.findOneAndUpdate(
      {'token': tokenId},
      { '$set': { 'temp': temp, 'status': 'in_progress' }},
      { new: true}
    );
  }

  async setPollCompleted(tokenId: string): Promise<EvaluatedType|null> {
    return EvaluatedRepository.findOneAndUpdate(
      {'token': tokenId},
      { '$set': { 'status': 'completed' }},
      { new: true}
    );
  }
}

export default new EvaluatedService();
