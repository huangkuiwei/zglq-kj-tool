import userApi from '@/api/user'
import { Message } from 'element-ui'

const app = {
  state: {
    menus: [],
    permi: [],
    components: [],
    permittedRoutes: [],
    routerMap: [],
    isAdminLogon: false,
    loaded: false,
  },
  mutations: {
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_PERMI: (state, paylod) => {
      state.permi = paylod
      localStorage.setItem('permi',paylod)
    },
    SET_COMPONENTS: (state, components) => {
      state.components = components
    },
    SET_ROUTER_MAP: (state, routers) => {
      state.routerMap = routers
    },
    SET_PERMITTED_ROUTES: (state, permitted) => {
      state.permittedRoutes = permitted
    },
    SET_IS_ADMIN_LOGON: (state, value) => {
      state.isAdminLogon = value
    },
    SET_LOADED: (state, value) => {
      state.loaded = value
    },
  },
  actions: {
    fetchPermissions({ commit }) {
      return new Promise(async (resolve, reject) => {
        const { success, data } = await userApi.getPermissions()
        if (success === false) {
          Message.error('获取权限数据失败，请稍后重试')
          reject('Get permissions failed')
        } else {
          const menus = data || []
          //const components = data.components || []
          commit('SET_MENUS', menus)
          commit('SET_COMPONENTS', menus)
          //commit('SET_IS_ADMIN_LOGON', data.isAdminLogon)
          resolve(data)
        }
      })
    },

    setRouterMap({ commit }, routerMap) {
      commit('SET_ROUTER_MAP', routerMap)
    },

    setPermittedRoutes({ commit }, permitted) {
      commit('SET_PERMITTED_ROUTES', permitted)
    },

    setPermissionsLoaded({ commit }) {
      commit('SET_LOADED', true)
    },

    setPermissionsUnLoaded({ commit }) {
      commit('SET_LOADED', false)
    },
  }
}

export default app
