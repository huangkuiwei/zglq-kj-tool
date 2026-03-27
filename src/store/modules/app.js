import Cookies from "js-cookie";
import projectApi from '@/api/project/all/index'
import util from "@/utils/auth";

const types = {
  SET_LEFT_COLLAPSE: "SET_LEFT_COLLAPSE", // 改变左边菜单的收缩宽度
};
const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get("sidebarStatus"),
      withoutAnimation: false,
    },
    darkMode: "",
    libType: "",
    arrowVisible: false,
    device: "desktop",
    clientHeight: null,
    clientWidth: null,
    projectList: [],
    projectCode: null,
    signalRTableData: null,
    paySuccessData: null,
    uploaderVisible: "clear",
    uploaderTab_Index: 0,
    fileDataClone: [],
    downLoadFileDataClone: [],
    preViewContainerVisible: false,
    preViewContainerData: null,
    modelPreViewContainerVisible: false,
    modelPreViewContainerDisplayVisible: false,
    modelPreViewInitUrl: null,
    preViewDownloadBtnVisible: true,
    activeTab: "desktop", // 当前主tab项，by YGP
    isCollapse: true, // 菜单默认展开
    currApp: "ABC", // 当前要进入的app, by ygp
    teamworkClientWidth: 0,
    shareMode: false,
    corpSpaceContainerVisible: false,
    showSearch: false,
    corpIdForProjectSpace: null,
    projectSpaceDialogVisible: false,
    registedPersonContainerVisible: false,
    shareCountItemContainerVisible: false,
    projectLeftMenuActive: null,
    projectPageScrollTop: 0,
    projectPageIndex: 1,
    projectPageNumber: 15,
    partOfDeleteSuccessContainerVisible: false,
    queryResourceTree: 'finish',
    queryPrivateResourceTree: 'finish',
  },
  getters: {
    isCollapse: (state) => state.isCollapse,
  },
  mutations: {
    SET_SHOW_SEARCH(state, paylod) {
      state.showSearch = paylod;
    },
    TOGGLE_SIDEBAR: (state) => {
      if (state.sidebar.opened) {
        Cookies.set("sidebarStatus", 1);
      } else {
        Cookies.set("sidebarStatus", 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
    },
    LIB_TYPE_CHANGE(state, e) {
      state.libType = e;
    },
    SET_ACTIVE_TAB(state, item) {
      state.activeTab = item;
    },
    SET_DARK_MODE(state, item) {
      state.darkMode = item;
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set("sidebarStatus", 1);
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    },
    SETCLIENT_HIGHT: (state, h) => {
      state.clientHeight = h;
    },
    SETCURRAPP: (state, app) => {
      state.currApp = app;
    },
    SETPROJECT_LIST: (state, list) => {
      state.projectList = list;
    },
    SETPROJECT_CODE: (state, code) => {
      state.projectCode = code;
    },
    SETSIGNALRTABLEDATA: (state, data) => {
      state.signalRTableData = data;
    },
    SETPAYSUCCESSDATA: (state, data) => {
      state.paySuccessData = data;
    },
    SETUPLOADER_VISIBLE: (state, visibleType) => {
      state.uploaderVisible = visibleType;
    },
    UPDATEFILEDATA_CLONE: (state, data) => {
      state.fileDataClone = state.fileDataClone.concat(data);
    },
    REMOVE_FILEDATA_CLONE: (state, data) => {
      state.fileDataClone = [];
    },
    SET_PREVIEW_CONTAINER_UNVISIBLE(state) {
      state.preViewContainerVisible = false;
    },
    CHANGE_UPLOADERTAB_INDEX(state, paylod) {
      state.uploaderTab_Index = paylod;
    },
    UPDATEPREVIEWCONTAINER_VISIBLE: (state, data) => {
      state.preViewContainerVisible = !state.preViewContainerVisible;
      state.preViewContainerData = data;
    },
    UPDATEDOWNLOADFILEDATA_CLONE: (state, data) => {
      data.fileName = decodeURIComponent(data.fileName);
      data.isdownload = true
      state.downLoadFileDataClone = state.downLoadFileDataClone.concat(data);
    },
    REMOVE_DOWNLOAD_FILEDATA_CLONE: (state, data) => {
      state.downLoadFileDataClone.splice(data, 1);
    },
    [types.SET_LEFT_COLLAPSE](state) {
      state.isCollapse = !state.isCollapse;
    },
  },
  actions: {
    queryRecentlyProject() {
      return new Promise(async (resolve, reject) => {
        var postData = new FormData();
        postData.append("page", 1);
        postData.append("rows", 1);
        postData.append("dataRule", 'lately');
        postData.append("Orderby", 'DESC');
        var res = await projectApi.queryProjectPageList(postData);
        if (res.code == 1) {
          if (res.data.length > 0) {
            resolve(res.data[0])
          } else {
            resolve(undefined)
          }
        } else {
          resolve(undefined)
        }
      })
    },
    SETSignalRTableData({ commit }, data) {
      commit("SETSIGNALRTABLEDATA", data);
    },
    SETPaySuccessData({ commit }, data) {
      commit("SETPAYSUCCESSDATA", data);
    },
    SetProjectInfo({ commit }) {
      var projectListStr = util.getProjectList();
      var list = JSON.parse(projectListStr);
      var currentProjectCode = util.getProjectCode();
      if (projectListStr && list.length > 0) {
        var valueList = list.map((x) => {
          return x.value;
        });
        if (valueList.indexOf(currentProjectCode) == -1) {
          util.setProjectCode(list[0].value);
        }
        var code = util.getProjectCode();
        commit("SETPROJECT_CODE", code);
        commit("SETPROJECT_LIST", list);
      } else {
        commit("SETPROJECT_CODE", null);
        commit("SETPROJECT_LIST", []);
      }
    },
    ToggleSideBar: ({ commit }) => {
      commit("TOGGLE_SIDEBAR");
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit("CLOSE_SIDEBAR", withoutAnimation);
    },
    ToggleDevice({ commit }, device) {
      commit("TOGGLE_DEVICE", device);
    },
    SETClientHight({ commit }, h) {
      commit("SETCLIENT_HIGHT", h);
    },
    SETCurrApp({ commit }, app) {
      commit("SETCURRAPP", app);
    },
    ChangeUploderVisible({ commit }, visibleType) {
      commit("SETUPLOADER_VISIBLE", visibleType);
    },
    UpdateFileDataClone({ commit }, data) {
      commit("UPDATEFILEDATA_CLONE", data);
    },
    UpdatePreViewContainerVisible({ commit }, data) {
      commit("UPDATEPREVIEWCONTAINER_VISIBLE", data);
    },
    UpdateDownLoadFileDataClone({ commit }, data) {
      commit("UPDATEDOWNLOADFILEDATA_CLONE", data);
    },
    setLeftCollapse: ({ commit }) => {
      commit(types.SET_LEFT_COLLAPSE);
    },
  }
};
export default app;
