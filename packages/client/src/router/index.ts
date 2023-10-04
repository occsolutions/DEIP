
import Vue from 'vue'
import Router from 'vue-router'

import AppLayout from '../views/app-layout.vue'
import AuthLayout from '../views/auth/auth-layout.vue'
import Dashboard from '../views/dashboard.vue'

// Questionnaires
import ListQuestionnaires from '../views/questionnaires/list.vue'
import CreateQuestionnaires from '../views/questionnaires/create.vue'
import EditQuestionnaires from '../views/questionnaires/edit.vue'
import EditQuestionnaireInfo from '../views/questionnaires/edit-questionnaire.vue'

// Evaluations
import CreateEvaluation from '../views/evaluations/create.vue'
import EditEvaluation from '../views/evaluations/edit.vue'
import ListEvaluations from '../views/evaluations/list.vue'
import ShowEvaluation from '../views/evaluations/show.vue'

import EvaluationLayout from '../views/evaluations/evaluation-layout.vue'
import Evaluation from '../views/evaluations/evaluation.vue'

// Reports
import Reports from '../views/evaluations/reports.vue'

// Operations summary
import OperationSummary from '../views/operations/summary.vue'

// Errors
import Forbidden from '../views/errors/forbidden.vue'
import NotFound from '../views/errors/not-found.vue'
import InvalidEnterprise from '../views/errors/invalid-enterprise.vue'
import RequireProductView from '../views/errors/require-product.vue'

import Home from '../views/home.vue'
import Maintenance from '../views/maintenance.vue'

import FollowUps from '../views/follow-ups/index.vue'

import RequireProduct from './guards/require-product'
import RequireAdmin from './guards/require-admin'
import RequireAuthentication from './guards/require-authentication'
import RequireEnterprise from './guards/require-enterprise'
import SsoAuthentication from './guards/sso-authentication'

Vue.use(Router)

const routes = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'sso',
        beforeEnter: SsoAuthentication
      },
      {
        path: 'sign-in',
        beforeEnter: RequireAuthentication
      }
    ]
  },
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        component: Home,
        beforeEnter: RequireAuthentication
      },
      {
        path: '/dashboard',
        component: Dashboard,
        beforeEnter: RequireAuthentication
      },
      {
        path: '/questionnaires',
        component: ListQuestionnaires,
        beforeEnter: RequireAdmin
      },
      {
        path: '/questionnaires/create',
        component: CreateQuestionnaires,
        beforeEnter: RequireAdmin
      },
      {
        path: '/questionnaires/:slug/edit',
        component: EditQuestionnaires,
        beforeEnter: RequireAdmin
      },
      {
        path: '/questionnaires/:slug/edit-questionnaire',
        component: EditQuestionnaireInfo,
        beforeEnter: RequireAdmin
      },
      {
        path: '/evaluations',
        component: ListEvaluations,
        beforeEnter: RequireAuthentication
      },
      {
        path: '/evaluations/create',
        component: CreateEvaluation,
        beforeEnter: RequireAuthentication
      },
      {
        path: '/evaluations/:slug/edit',
        component: EditEvaluation,
        beforeEnter: RequireAuthentication
      },
      {
        path: '/evaluations/:slug/details',
        component: ShowEvaluation,
        beforeEnter: RequireAuthentication
      },
      {
        path: '/followup/:type/:pollId',
        component: FollowUps,
        beforeEnter: RequireAuthentication
      },
      {
        path: '/evaluations/reports/:id',
        component: Reports,
        beforeEnter: RequireAuthentication
      }
    ]
  },
  {
    path: '/deip',
    component: EvaluationLayout,
    children: [
      {
        path: 'individual/:tokenId',
        component: Evaluation
      }
    ]
  },
  {
    path: '/forbidden',
    component: Forbidden
  },
  {
    path: '/maintenance',
    component: Maintenance
  },
  {
    path: '*',
    redirect: '/404'
  },
  {
    path: '/404',
    component: NotFound
  },
  {
    path: '/invalid-enterprise',
    component: InvalidEnterprise,
    beforeEnter: RequireEnterprise
  },
  {
    path: '/ask-product',
    component: RequireProductView,
    beforeEnter: RequireProduct
  },
  {
    path: '/operation-summary/:type/:slug/:editCount?',
    component: OperationSummary
  }
]

export default new Router({
  mode: 'history',
  routes
})
