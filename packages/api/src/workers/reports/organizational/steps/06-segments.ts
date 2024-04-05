
import { default as EvaluationsService } from '../../../../services/evaluations.srvc';
import { default as EvaluatedService } from '../../../../services/evaluated.srvc';

export default async (
  evaluationId: string
) => {
  const resp = {};
  const current: any = await EvaluationsService.findById(evaluationId, 'additionalSegmentation');
  if (!current) return;

  const segmentation = current.additionalSegmentation;
  // Loop Additional Segmentations
  for (const key in segmentation) {
    const segment = segmentation[key];
    if (segment.selected) {// Only if it was selected for the poll
      resp[key] = {};

      // Loop Additional Segmentation Details
      for (const detail of segment.details) {
        if (detail.active) {// Only if active detail
          // Count
          resp[key][detail.code] = await EvaluatedService.countCompletedBySegmentation(
            evaluationId,
            segment.id,
            detail.id,
          );
        }
      }

      // Prefer not to answer (-1)
      if (!resp[key].hasOwnProperty('no_answer')) {
        resp[key]['no_answer'] = await EvaluatedService.countCompletedBySegmentation(
          evaluationId,
          segment.id,
          -1,
        );
      }
    }
  }

  return resp;
};
