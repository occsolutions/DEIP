
import { default as OperationThreadsService } from '../../services/operation-threads.srvc';
import { default as EvaluationService } from '../../services/evaluations.srvc';
import { default as EvaluationAnswersService } from '../../services/evaluation-answers.srvc';

class EvaluationMethods {

  public async checkStartEndDates() {
    const resp = { launched: 0, closed: 0, reminders: 0 };
    const pendingEvaluations = await EvaluationService.filterByStatus('pending');
    const progressEvaluations = await EvaluationService.filterByStatus('in_progress');

    const localDate = new Date();

    // Pending Evaluations
    const pendingEvaluationsIds = [];
    for (const pendingEvaluation of pendingEvaluations) {
      const diffTimeZone = Number(pendingEvaluation.timeZone.substring(4, 7));
      const timeAdapted = new Date(localDate.getTime() + (3600000 * diffTimeZone));
      if (timeAdapted > pendingEvaluation.deliveredAt) {
        pendingEvaluationsIds.push(pendingEvaluation._id);
        // Queue Launch Emails
        await this.queueEvaluationEmail(pendingEvaluation._id, 'launch');
        // Update Suite Activity
        await EvaluationService.updateSuiteActivity(pendingEvaluation, 'in_progress');
        resp.launched++;
      }
    }

    if (pendingEvaluationsIds.length > 0) {
      // Launch Evaluations
      await EvaluationService.updateStatus('in_progress', pendingEvaluationsIds);
    }

    // Evaluations in Progress
    const expiredEvaluationsIds = [];
    for (const progressEvaluation of progressEvaluations) {
      const diffTimeZone = Number(progressEvaluation.timeZone.substring(4, 7));
      const timeAdapted = new Date(localDate.getTime() + (3600000 * diffTimeZone));
      if (timeAdapted > progressEvaluation.validUntil) {
        expiredEvaluationsIds.push(progressEvaluation._id);
        // Update Suite Activity
        await EvaluationService.updateSuiteActivity(progressEvaluation, 'completed');
        resp.closed++;
      } else if (progressEvaluation.reminders) {
        for (const reminder of progressEvaluation.reminders) {
          if (timeAdapted > reminder.dateTime && reminder.status === 'pending') {
            reminder.status = 'completed';
            // Queue Reminder Emails
            await this.queueEvaluationEmail(progressEvaluation._id, 'reminder');
            resp.reminders++;
          }
        }
        if (resp.reminders) {
          await EvaluationService.updateReminders(progressEvaluation._id, progressEvaluation.reminders);
        }
      }
    }

    if (expiredEvaluationsIds.length > 0) {
      // Close Evaluation
      await EvaluationService.updateStatus('completed', expiredEvaluationsIds);

      // Update participation count (answered polls)
      for (const expiredEvaluationId of expiredEvaluationsIds) {
        const totalAnswered = await EvaluationAnswersService.countByEvaluationId(expiredEvaluationId);
        await EvaluationService.updateAnsweredCount(expiredEvaluationId, totalAnswered);
      }
    }

    return resp;
  }

  private async queueEvaluationEmail (evaluationId: any, type: 'launch'|'reminder') {
    return OperationThreadsService.save({
      operation: 'SendEvaluationEmail',
      status: 'pending',
      createdAt: new Date(),
      data: {
        _evaluation: evaluationId,
        type
      }
    });
  }
}

export default new EvaluationMethods();
