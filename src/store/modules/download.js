import { uploadTaskManager, downloadTaskManager, TaskStatus } from '@/utils/taskStorage'

const downloadData = {
  state: {
    uploads: [],
    downloads: [],
    showTaskManager: false,
    activeTab: 'downloads'
  },

  mutations: {
    SET_UPLOADS(state, uploads) {
      state.uploads = uploads
    },
    SET_DOWNLOADS(state, downloads) {
      state.downloads = downloads
    },
    ADD_UPLOAD(state, task) {
      state.uploads.unshift(task)
    },
    UPDATE_UPLOAD(state, { id, updates }) {
      const index = state.uploads.findIndex(t => t.id === id)
      if (index !== -1) {
        state.uploads[index] = { ...state.uploads[index], ...updates }
      }
    },
    REMOVE_UPLOAD(state, id) {
      const index = state.uploads.findIndex(t => t.id === id)
      if (index !== -1) {
        state.uploads.splice(index, 1)
      }
    },
    ADD_DOWNLOAD(state, task) {
      state.downloads.unshift(task)
    },
    UPDATE_DOWNLOAD(state, { id, updates }) {
      const index = state.downloads.findIndex(t => t.id === id)
      if (index !== -1) {
        state.downloads[index] = { ...state.downloads[index], ...updates }
      }
    },
    REMOVE_DOWNLOAD(state, id) {
      const index = state.downloads.findIndex(t => t.id === id)
      if (index !== -1) {
        state.downloads.splice(index, 1)
      }
    },
    SET_SHOW_TASK_MANAGER(state, show) {
      state.showTaskManager = show
    },
    SET_ACTIVE_TAB(state, tab) {
      state.activeTab = tab
    }
  },

  actions: {
    // 初始化加载任务
    loadTasks({ commit }) {
      const uploads = uploadTaskManager.getTasks()
      const downloads = downloadTaskManager.getTasks()
      commit('SET_UPLOADS', uploads)
      commit('SET_DOWNLOADS', downloads)
    },

    // 添加上传任务
    addUploadTask({ commit }, task) {
      const savedTask = uploadTaskManager.addTask(task)
      commit('ADD_UPLOAD', savedTask)
      return savedTask
    },

    // 更新上传任务
    updateUploadTask({ commit }, { id, updates }) {
      const updated = uploadTaskManager.updateTask(id, updates)
      if (updated) {
        commit('UPDATE_UPLOAD', { id, updates })
      }
      return updated
    },

    // 删除上传任务
    removeUploadTask({ commit }, id) {
      uploadTaskManager.removeTask(id)
      commit('REMOVE_UPLOAD', id)
    },

    // 添加下载任务
    addDownloadTask({ commit }, task) {
      const savedTask = downloadTaskManager.addTask(task)
      commit('ADD_DOWNLOAD', savedTask)
      return savedTask
    },

    // 更新下载任务
    updateDownloadTask({ commit }, { id, updates }) {
      const updated = downloadTaskManager.updateTask(id, updates)
      if (updated) {
        commit('UPDATE_DOWNLOAD', { id, updates })
      }
      return updated
    },

    // 删除下载任务
    removeDownloadTask({ commit }, id) {
      downloadTaskManager.removeTask(id)
      commit('REMOVE_DOWNLOAD', id)
    },

    // 清空已完成任务
    clearCompletedTasks({ dispatch }) {
      uploadTaskManager.clearCompletedTasks()
      downloadTaskManager.clearCompletedTasks()
      dispatch('loadTasks')
    }
  },

  getters: {
    activeTaskCount: (state) => {
      const activeUploads = state.uploads.filter(t =>
        t.status === TaskStatus.UPLOADING || t.status === TaskStatus.PENDING
      ).length
      const activeDownloads = state.downloads.filter(t =>
        t.status === TaskStatus.DOWNLOADING || t.status === TaskStatus.PENDING
      ).length
      return activeUploads + activeDownloads
    },

    totalUploadProgress: (state) => {
      if (state.uploads.length === 0) return 0
      const total = state.uploads.reduce((sum, task) => sum + (task.progress || 0), 0)
      return Math.floor(total / state.uploads.length)
    },

    totalDownloadProgress: (state) => {
      if (state.downloads.length === 0) return 0
      const total = state.downloads.reduce((sum, task) => sum + (task.progress || 0), 0)
      return Math.floor(total / state.downloads.length)
    }
  }
}

export default downloadData