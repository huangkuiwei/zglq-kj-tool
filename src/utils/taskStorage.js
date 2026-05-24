// utils/taskStorage.js
// 任务状态常量
export const TaskStatus = {
  PENDING: 'pending',       // 等待中
  UPLOADING: 'uploading',   // 上传中
  DOWNLOADING: 'downloading', // 下载中
  PAUSED: 'paused',         // 已暂停
  SUCCESS: 'success',       // 成功
  ERROR: 'error'            // 错误
}

// 存储键名
const STORAGE_KEYS = {
  UPLOADS: 'file_uploads',
  DOWNLOADS: 'file_downloads'
}

// 上传任务管理
export const uploadTaskManager = {
  // 获取所有上传任务
  getTasks() {
    const tasks = localStorage.getItem(STORAGE_KEYS.UPLOADS)
    return tasks ? JSON.parse(tasks) : []
  },

  // 保存上传任务
  saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.UPLOADS, JSON.stringify(tasks))
  },

  // 添加任务
  addTask(task) {
    const tasks = this.getTasks()
    tasks.unshift(task)
    this.saveTasks(tasks)
    return task
  },

  // 更新任务
  updateTask(taskId, updates) {
    const tasks = this.getTasks()
    const index = tasks.findIndex(t => t.id === taskId)
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates, updateTime: Date.now() }
      this.saveTasks(tasks)
      return tasks[index]
    }
    return null
  },

  // 删除任务
  removeTask(taskId) {
    const tasks = this.getTasks()
    const filtered = tasks.filter(t => t.id !== taskId)
    this.saveTasks(filtered)
  },

  // 获取单个任务
  getTask(taskId) {
    const tasks = this.getTasks()
    return tasks.find(t => t.id === taskId)
  },

  // 清空已完成的任务（可配置保留天数）
  clearCompletedTasks(daysToKeep = 7) {
    const tasks = this.getTasks()
    const now = Date.now()
    const keepTime = daysToKeep * 24 * 60 * 60 * 1000

    const filtered = tasks.filter(task => {
      if (task.status === TaskStatus.SUCCESS || task.status === TaskStatus.ERROR) {
        return (now - (task.updateTime || task.createTime)) < keepTime
      }
      return true // 未完成的任务保留
    })

    this.saveTasks(filtered)
  }
}

// 下载任务管理
export const downloadTaskManager = {
  getTasks() {
    const tasks = localStorage.getItem(STORAGE_KEYS.DOWNLOADS)
    return tasks ? JSON.parse(tasks) : []
  },

  saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(tasks))
  },

  addTask(task) {
    const tasks = this.getTasks()
    tasks.unshift(task)
    this.saveTasks(tasks)
    return task
  },

  updateTask(taskId, updates) {
    const tasks = this.getTasks()
    const index = tasks.findIndex(t => t.id === taskId)
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates, updateTime: Date.now() }
      this.saveTasks(tasks)
      return tasks[index]
    }
    return null
  },

  removeTask(taskId) {
    const tasks = this.getTasks()
    const filtered = tasks.filter(t => t.id !== taskId)
    this.saveTasks(filtered)
  },

  getTask(taskId) {
    const tasks = this.getTasks()
    return tasks.find(t => t.id === taskId)
  },

  clearCompletedTasks(daysToKeep = 7) {
    const tasks = this.getTasks()
    const now = Date.now()
    const keepTime = daysToKeep * 24 * 60 * 60 * 1000

    const filtered = tasks.filter(task => {
      if (task.status === TaskStatus.SUCCESS || task.status === TaskStatus.ERROR) {
        return (now - (task.updateTime || task.createTime)) < keepTime
      }
      return true
    })

    this.saveTasks(filtered)
  }
}