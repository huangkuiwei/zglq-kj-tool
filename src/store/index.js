import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import downloadData from './modules/download'
import route from './modules/route'
import permissions from './modules/permissions'
import getters from './getters'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    downloadData,
    route,
    permissions,
  },
  getters,
})

export default store
