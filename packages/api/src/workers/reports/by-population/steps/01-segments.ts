
import SegmentsUtils from '../utils/segments';

export default async (
  evaluationId: any,
  user: any,
  criteria: any,
) => {

  const resp = {
    success: false,
    segments: {},
    segmentedInitAnswers: {},
    error: undefined
  };

  if (criteria.type === 'demographic') {
    // Demographic Cuts
    const demographics = await SegmentsUtils.getDemographics(user, criteria.code);
    resp.success = demographics.success;
    if (resp.success) {
      resp.segments = demographics.res.items || demographics.res;
      resp.segmentedInitAnswers = await SegmentsUtils.initSegmentedAnswers(resp.segments);
    } else {
      resp.error = demographics.error;
    }
  } else {
    // Additional Segmentation
    const segmentsDetails = await SegmentsUtils.getSegmentations(evaluationId, user, criteria.code);
    resp.success = segmentsDetails.success;
    if (resp.success) {
      resp.segments = segmentsDetails.res;
      resp.segmentedInitAnswers = await SegmentsUtils.initSegmentedAnswers(resp.segments);
    } else {
      resp.error = segmentsDetails.error;
    }
  }

  return resp;

};
