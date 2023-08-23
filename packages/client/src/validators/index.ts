
import { extend, localize, ValidationObserver, ValidationProvider } from 'vee-validate'
import es from 'vee-validate/dist/locale/es.json'
import * as rules from 'vee-validate/dist/rules'
import dateAfterValidator from './date-after'
import dateNowAfterValidator from './date-now-after'
import dateBeforeValidator from './date-before'
import dateBetweenValidator from './date-between'
import dateNowBeforeValidator from './date-now-before'

export default (vue: any) => {
  for (const [rule, validation] of Object.entries(rules)) {
    if (rule === 'required') {
      const item: any = {
        ...validation,
        message: () => 'Este campo es obligatorio'
      }
      extend(rule, item)
    } else {
      extend(rule, validation as any)
    }
  }
  localize('es', es)

  // Registramos reglas personalizadas
  const customRules = [dateBeforeValidator, dateNowBeforeValidator, dateAfterValidator, dateNowAfterValidator,
    dateBetweenValidator]

  for (const rule of customRules) {
    extend(rule.name, rule.definition)
  }

  vue.component('ValidationObserver', ValidationObserver)
  vue.component('ValidationProvider', ValidationProvider)
}
