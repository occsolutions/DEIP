
import languages from './languages'
import auth from './auth'
import errors from './errors'

export default {
  /* Gerenal labels */
  title: 'OCC Solutions - DEIP',
  active: 'Active',
  inactive: 'Inactive',
  no_data: 'No records',
  copyright: 'All rights reserved 2019',
  go_back: 'Go Back',
  results_per_pages: 'Results per pages',
  manual: 'Help manuals',
  page_all: 'All',
  /* Models */
  models: {
    enterprises: 'Enterprises',
    groups: 'Groups',
    pulse: 'Pulse'
  },
  maintenance: 'Page under construction',
  // tslint:disable-next-line:max-line-length
  maintenance_text: 'We work each day to achieve the objectives<br/>and give you the best results and experiences.',
  /* Labels grouped by modules or type */
  languages,
  auth,
  errors,
  page_text: 'of'
}
