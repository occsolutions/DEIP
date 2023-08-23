
import config from './config'

// const runGetConfig = () => {
//   const ACL_KEY = 'occ-key-wolf'
//   const wolfValue = JSON.parse(localStorage.getItem(ACL_KEY) || '{}')
//   return getConfig.decoding(wolfValue.bt, wolfValue.sec)
// }
// const config = runGetConfig()

class ACL {
  constructor (private aclConfig: any) {
    this.aclConfig = aclConfig
  }

  public can (permission: string, session: any) {
    const accessCondition = this.getAccessCondition(permission)
    if (accessCondition === true) {
      return true
    }

    return accessCondition
      .map((rolesStr: string) => this.getRoles(rolesStr))
      .find((roles: { user: string; view: string }) => {
        const viewRoleMatch = !roles.view || session.user.view === roles.view
        const userRoleMath = session.user.role === roles.user
        return viewRoleMatch && userRoleMath
      }) !== undefined
  }

  private getAccessCondition (permissionStr: string): any {
    let accessCondition = this.aclConfig
    for (const permission of permissionStr.split('.')) {
      accessCondition = accessCondition[permission]
      if (accessCondition === undefined) {
        Error(`permission '${permissionStr}' not defined`)
        // throw new Error(`permission '${permissionStr}' not defined`)
        return false
      }
    }

    return accessCondition
  }

  private getRoles (roles: string): { user: string; view: string } {
    const splittedRoles = roles.split('.')
    return { user: splittedRoles[0], view: splittedRoles[1] }
  }
}

export { ACL, config }
