import { decrypt, encrypt } from '@/utils/index'

const tokenKey = '06f0d34cf875a244b9725dbc19c827dd'
const corpRecordTabActivedKey = '06f0d34cf87iop4b9725dbc19c827dd'
const userCenterMenuActivedKey = '06f0d34cf87iop4b9fdsfdgg725dbc19c827dd'
const userKey = '58dc37da9e552908e7b0e08f230d3277'
const ddConfigKey = '565987419e552908e7b0e08f230d3277'
const loginQueryKey = 'query'
const loginOrRegistPageKey = 'lrPageLink'

export default {
  //token
  getToken() {
    // var testData = {
    //   UserID: 102,
    //   UserName: ""
    // }
    // this.setToken(JSON.stringify(testData))
    return localStorage.getItem(tokenKey)
  },


  setToken(token) {
    localStorage.setItem(tokenKey, token)
  },

  getLoginOrRegistPageLink() {
    return localStorage.getItem(loginOrRegistPageKey)
  },
  removeLoginOrRegistPageLink() {
    localStorage.removeItem(loginOrRegistPageKey)
  },

  getCorpRecordTabActived(){
    return localStorage.getItem(corpRecordTabActivedKey)   
  },
  setCorpRecordTabActived(index) {
    localStorage.setItem(corpRecordTabActivedKey, index)
  },
  removeCorpRecordTabActived() {
    localStorage.removeItem(corpRecordTabActivedKey)
  },

  getUserCenterMenuActived(){
    return localStorage.getItem(userCenterMenuActivedKey)   
  },
  setUserCenterMenuActived(index){
    localStorage.setItem(userCenterMenuActivedKey,index)
  },
  removeUserCenterMenuActived() {
    localStorage.removeItem(userCenterMenuActivedKey)
  },

  //第三方企业应用缓存, {corpId,appType:'inside' || 'undefined'}
  getLoginQuery(){
    return localStorage.getItem(loginQueryKey)
  },
  removeToken() {
    localStorage.removeItem(tokenKey)
  },
  //user
  getUser() {
    const user = decrypt(localStorage.getItem(userKey))
    try {
      return JSON.parse(user)
    } catch(err) {
      console.error('user info did not find in local storage', err)
      return null
    }
  },

  setUser(user) {
    localStorage.setItem(userKey, encrypt(JSON.stringify(user)))
  },

  removeUser() {
    localStorage.removeItem(userKey)
  },

}
