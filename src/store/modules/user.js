import userApi from "@/api/user";
import postApi from "@/api/document/indexApi";
import Cookies from "js-cookie";
import local from "@/utils/auth";
import signalR from "@/utils/signalR";
import { decrypt } from '@/utils'
import request from '@/utils/request'

const setLoginStatus = (token, user) => {
  local.setToken(token);
  local.setUser(user);
};
const clearLoginStatus = () => {
  local.removeToken();
  local.removeUser();
};

const user = {
  state: {
    token: local.getToken(),
    inDingTalk: false,
    name: "",
    avatar: "",
    bitpop: false,
    user: {},
    pwdDialogVisible: false,
    messageList: {
      usermes: {},
      checkmes: {},
    },
    messageListCount: 0,
    hasNotDealApply: false,
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_INDINGTALK: (state, inDingTalk) => {
      state.inDingTalk = inDingTalk;
    },
    SET_BITPOP: (state, bitpop) => {
      state.bitpop = bitpop;
    },
    SET_MSG_LIST: (state, list) => {
      state.messageList = list;
    },
    SET_MSG_LIST_COUNT: (state, count) => {
      state.messageListCount = count;
    },
    SET_PWD_DIALOG(state, boolean) {
      state.pwdDialogVisible = boolean
    }
  },

  actions: {
    // 登录
    AdminLogin({ commit }, user) {
      return new Promise(async (resolve, reject) => {
        var response = await userApi.adminLogin(user);
        if (response.code === 1) {
          response.data = JSON.parse(decrypt(response.data))

          console.log('response.data', response.data)

          if (!response.data.isfirst) {
            const data = response.data;
            const user = {
              userID: data.userID,
              username: data.userName,
              iscorpadmin: data.iscorpadmin,
              isadministrator: data.isadministrator,
              avatar: data.avatar,
              systemIsPersonal: data.systemIsPersonal,
              corpIdbit: data.corpIdbit,
              setuproletypelist: data.setuproletypelist || []
            };
            //存Token
            setLoginStatus(data.jwt, user);
            localStorage.setItem('isOverseas', data.isOverseas || data.IsOverseas)
            commit("SET_TOKEN", data.token);
            commit("SET_USER", user);
            commit("SET_BITPOP", data.bitpop);
          }
          resolve(response);
        }
      });
    },
    TkyLogin({ commit }) {
      return new Promise(async (resolve, reject) => {
        var response = await userApi.TkyLogin();
        if (response.code === 1) {
          const data = response.data;
          const user = {
            username: data.userName,
            isadministrator: data.isadministrator,
            avatar: data.avatar,
            systemIsPersonal: data.systemIsPersonal,
            corpIdbit: data.corpIdbit,
            userID: data.userID,
          };
          //存Token
          setLoginStatus(data.jwt, user);
          commit("SET_TOKEN", data.token);
          commit("SET_USER", user);
          commit("SET_BITPOP", data.bitpop);
        }
        resolve(response);
      });
    },
    // 更新消息
    GetMsgData({ commit }) {
      return new Promise(async (resolve, reject) => {
        var res = await postApi.post("/api/WebCompanyApply/GetMessage");
        commit('SET_MSG_LIST', res.data)
        commit('SET_MSG_LIST_COUNT', res.count)
        resolve(res);
      });
    },
    // 获取用户信息
    SetInDingTalk({ commit }) {
      commit("SET_INDINGTALK", true);
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const user = local.getUser();
        commit("SET_USER", user);
        resolve(user);
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return request.get('api/Home/quitLogin').finally(() => {
        Cookies.remove("CRBIMSSOJWT");
        commit("SET_TOKEN", "");
        commit("SET_PERMI", "");
        localStorage.setItem('isOverseas', '')
        commit("SET_USER", {});
        clearLoginStatus();
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return request.get('api/Home/quitLogin').finally(() => {
        Cookies.remove("CRBIMSSOJWT");
        commit("SET_PERMI", "");
        commit("SET_TOKEN", "");
        localStorage.setItem('isOverseas', '')
        commit("SET_USER", {});
        clearLoginStatus();
      })
    },
  },
};

export default user;
