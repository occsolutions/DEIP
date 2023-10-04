
export default {
  dashboard: {
    list: ['admin', 'customer', 'employee', 'enterprise_admin']
  },
  evaluation: {
    list: ['customer', 'enterprise_admin'],
    create: ['admin', 'customer', 'employee', 'enterprise_admin'],
    edit: ['admin', 'customer', 'employee', 'enterprise_admin'],
    show: ['admin', 'customer', 'employee', 'enterprise_admin'],
    answer: ['admin', 'customer', 'employee', 'enterprise_admin'],
    close: ['admin', 'customer', 'employee', 'enterprise_admin']
  },
  productService: {
    list: ['admin', 'customer', 'employee', 'enterprise_admin'],
    create: ['admin', 'customer', 'employee', 'enterprise_admin'],
    edit: ['admin', 'customer', 'employee', 'enterprise_admin'],
    show: ['admin', 'customer', 'employee', 'enterprise_admin']
  },
  questionnaires: {
    listAll: ['admin'],
    list: ['admin', 'customer', 'enterprise_admin'],
    create: ['admin'],
    edit: ['admin'],
    show: ['admin']
  }
}
