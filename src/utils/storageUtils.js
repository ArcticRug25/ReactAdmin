/*
进行local数据存储管理的工具模块
 */
// import store from 'store'
const USER_KEY = 'user_key'

function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  // store.set(USER_KEY, user)
}

function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
  // return store.get(USER_KEY) || {}
}

function removeUser() {
  localStorage.removeItem(USER_KEY)
  // store.remove(USER_KEY)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  /*
  保存user
   */
  saveUser,
  /*
  读取user
   */
  getUser,
  /*
  删除user
   */
  removeUser
}