
import { IMenuGroup } from './interfaces/menu-group'
import { IMenuLeaf } from './interfaces/menu-leaf'

const baseGroups: Array<IMenuGroup | IMenuLeaf> = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: 'dashboard'
  },
  {
    title: 'questionnaires',
    path: '/questionnaires',
    icon: 'fa-list-ul',
    permission: 'questionnaires.listAll'
  },
  {
    title: 'open_questions',
    path: '/open-questions',
    icon: 'mdi-comment-question-outline',
    permission: 'openQuestions.listAll'
  },
  {
    title: 'evaluations',
    path: '/evaluations',
    icon: 'fa-chart-bar',
    permission: 'evaluation.list'
  },
  {
    title: 'suite',
    icon: 'mdi-apps',
    path: '/',
    goto: 'suite'
  }
]

export { baseGroups }
