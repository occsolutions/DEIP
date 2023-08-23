
export default (vue: any, scope: any) => {
  return vue.$validator.validateAll(scope)
    .then((valid: any) => {
      if (!valid) {
        vue.$store.dispatch('alert/error', vue.$t('errors.validator/verify_fields'))
      }
      return valid
    })
}
