import request from '@/utils/request'


export function getSmRole(id, dom) {
  return request({
    url: `api/services/app/SmRole/GetTree?id=${id}`,
    target: dom,
    isLock: true,
  })
}

export function addSmRole(data) {
  return request({
    url: 'api/services/app/SmRole/Create',
    method: 'POST',
    data
  })
}

export function upSmRole(data) {
  return request({
    url: 'api/services/app/SmRole/Update',
    method: 'PUT',
    data
  })
}

export function delSmRole(id) {
  return request({
    url: `api/services/app/SmRole/Delete?id=${id}`,
    method: 'DELETE'
  })
}

export function getOperationTree(id) {
  return request({
    url: `api/services/app/SmModuleOperation/GetRoleModuleOperationTree?RoleId=${id}`
  })
}

export function getBindRoleUser(opt) {
  return request({
    url: `api/services/app/SmUser/GetBindRoleUser?RoleID=${opt.id}&Search=${opt.search}&Sorting=sortNum&SkipCount=${opt.skipCount}&MaxResultCount=${opt.pageSize}`
  })
}

export function getUnboundRoleUser(opt) {
  return request({
    url: `api/services/app/SmUser/GetUnboundRoleUser?RoleID=${opt.id}&Search=${opt.search}&Sorting=sortNum&SkipCount=${opt.skipCount}&MaxResultCount=${opt.pageSize}`
  })
}

export function addUserToRole(data) {
  return request({
    url: `api/services/app/SmUserToRole/CreateMore`,
    method: 'POST',
    data
  })
}

export function delUserToRole(opt) {
  return request({
    url: `api/services/app/SmUserToRole/DeleteMore?UserId=${opt.ids}&RoleId=${opt.roleId}`,
    method: 'DELETE'
  })
}

export function submitRole(data) {
  return request({
    url: 'api/services/app/SmModuleOperation/CreateMoreByRole',
    method: 'POST',
    isLock: true,
    data
  })
}
