const fs = require('fs')
const path = require('path')
const axios = require('axios')
const { app, BrowserWindow, session } = require('electron')

// 活动下载任务
const activeDownloads = new Map()

function syncDownloadsData(data) {
  data.forEach(item => {
    let id = item.id
    activeDownloads.set(id, item)
  })
}

// 获取下载文件夹
function getDownloadPath() {
  return app.getPath('downloads')
}

let token = ''

// 开始下载
async function startDownload(url, filename, taskId, userinfotoken, isshenpi, shenpiData) {
  token = userinfotoken
  const downloadPath = getDownloadPath()

  let lastIndex = filename.lastIndexOf('.')
  let part1 = filename.slice(0, lastIndex)
  let part2 = '_' + taskId
  let part3 = filename.slice(lastIndex)
  let newFilename = part1 + part2 + part3

  const filePath = path.join(downloadPath, newFilename)
  // const totalSize = await getFileSize(url)
  const totalSize = 0
  let downloaded = 0

  // 创建下载任务对象
  const downloadTask = {
    id: taskId,
    url,
    filePath,
    filename,
    totalSize,
    totalSizeText: '-',
    downloaded,
    progress: 0,
    status: 'downloading',
    speed: 0,
    cancelToken: null,
    error: undefined,
    userinfotoken,
    isshenpi,
    shenpiData
  }

  activeDownloads.set(taskId, downloadTask)

  // 开始下载（异步，不阻塞）
  performDownload(taskId)

  return { success: true }
}

// 执行下载
async function performDownload(taskId, updateTask) {
  if (updateTask) {
    activeDownloads.set(taskId, updateTask)
  }

  const task = activeDownloads.get(taskId)
  if (!task || task.status !== 'downloading') return

  // 创建写入流（追加模式）
  const stream = fs.createWriteStream(task.filePath, { flags: 'a' })

  // 创建取消令牌
  const cancelTokenSource = axios.CancelToken.source()
  task.cancelToken = cancelTokenSource

  // 设置 Range 头
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
    userinfotoken: token,
    bwforweb: true
  }

  console.log('task.downloaded', task.downloaded)

  if (task.downloaded > 0) {
    headers['Range'] = `bytes=${task.downloaded}-`
  }

  let speed = 0
  let lastSpeedTime = Date.now()
  let lastSpeedBytes = task.downloaded

  try {
    const response = await axios({
      method: 'GET',
      url: task.url,
      headers,
      responseType: 'stream',
      cancelToken: cancelTokenSource.token,
      timeout: 30000,
    })

    task.totalSize = task.totalSize || Number(response.headers['content-length'] || 0)

    response.data.on('data', (chunk) => {
      task.downloaded += chunk.length

      // 计算速度
      const now = Date.now()
      const timeDiff = (now - lastSpeedTime) / 1000
      if (timeDiff >= 1) {
        const bytesDiff = task.downloaded - lastSpeedBytes
        speed = bytesDiff / timeDiff
        lastSpeedTime = now
        lastSpeedBytes = task.downloaded
      }

      // 发送进度更新（节流）
      const progress = task.totalSize ? (task.downloaded / task.totalSize) * 100 : 0

      if (task.totalSize === 0) {
        task.progress = 0
      } else {
        task.progress = progress
      }

      sendProgress({ ...task, cancelToken: null })
    })

    response.data.pipe(stream)

    // return new Promise((resolve, reject) => {
      stream.on('close', () => {
        task.status = 'completed'
        sendProgress({ ...task, cancelToken: null })
        // resolve()
      })

      stream.on('error', (err) => {
        task.status = 'error'
        sendProgress({ ...task, cancelToken: null })
        // reject(err)
      })

      cancelTokenSource.token.promise.catch((err) => {
        if (axios.isCancel(err)) {
          stream.end()
          task.status = 'paused'
          sendProgress({ ...task, cancelToken: null })
          // resolve()
        } else {
          // reject(err)
        }
      })
    // })
  } catch (error) {
    if (!axios.isCancel(error)) {
      task.status = 'error'
      sendProgress({ ...task, cancelToken: null })
    }
  }
}

// 发送进度到渲染进程
function sendProgress(task) {
  const windows = BrowserWindow.getAllWindows()
  if (windows.length > 0) {
    windows[0].webContents.send('download-progress', task)
  }
}

// 暂停下载
function pauseDownload(taskId) {
  const task = activeDownloads.get(taskId)
  if (task && task.cancelToken) {
    task.cancelToken.cancel('用户暂停下载')
    task.status = 'paused'
    sendProgress({ ...task, cancelToken: null })
  }
}

// 恢复下载
async function resumeDownload(taskId) {
  const task = activeDownloads.get(taskId)
  if (task && task.status === 'paused') {
    task.status = 'downloading'
    sendProgress({ ...task, cancelToken: null })
    performDownload(taskId)
  }
}

module.exports = {
  startDownload,
  pauseDownload,
  resumeDownload,
  syncDownloadsData,
  performDownload
}