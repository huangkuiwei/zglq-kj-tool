// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // 文件上传相关
  calculateFileHash: (filePath) => ipcRenderer.invoke('calculate-hash', filePath),
  uploadChunk: (data) => ipcRenderer.invoke('upload-chunk', data),
  mergeChunks: (data) => ipcRenderer.invoke('merge-chunks', data),
  checkUploadedChunks: (hash, totalChunks) => ipcRenderer.invoke('check-chunks', hash, totalChunks),
  getFilePath: (file) => ipcRenderer.invoke('get-file-path', file),

  // 文件下载相关
  startDownload: (url, filename, id) => ipcRenderer.invoke('start-download', url, filename, id),
  pauseDownload: (id) => ipcRenderer.invoke('pause-download', id),
  resumeDownload: (id) => ipcRenderer.invoke('resume-download', id),
  getDownloadProgress: (id) => ipcRenderer.invoke('get-download-progress', id),

  // 监听下载进度
  onDownloadProgress: (callback) => {
    ipcRenderer.on('download-progress', (event, data) => callback(data))
  },

  // 获取下载路径
  getDownloadPath: () => ipcRenderer.invoke('get-download-path'),

  // 打开文件夹
  openFolder: (path) => ipcRenderer.invoke('open-folder', path)
})