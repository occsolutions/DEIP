
import Components from './components'
import Views from './views'

import languages from './languages'
import auth from './auth'
import errors from './errors'
import help from './help'
import instructive from './instructive'

export default {
  Components,
  Views,
  /* General Labels */
  title: 'OCC Solutions - DEIP',
  active: 'Activo',
  inactive: 'Inactivo',
  no_data: 'No hay registros',
  go_back: 'Volver',
  results_per_pages: 'Resultados por páginas',
  page_all: 'Todos',
  /* Models */
  models: {
    enterprises: 'Empresas',
    groups: 'Grupos Empresariales',
    pulse: 'Pulse'
  },
  maintenance: 'Página en construcción',
  // tslint:disable-next-line:max-line-length
  maintenance_text: 'Trabajamos cada día para lograr los objetivos<br/>y darle mejores resultados y experiencias.',
  /* Labels grouped by modules or type */
  languages,
  auth,
  errors,
  help,
  instructive,
  page_text: 'de'
}
