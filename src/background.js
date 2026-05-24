'use strict'

import { app, protocol, BrowserWindow, Menu, session, globalShortcut, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import path from 'path'
import { pauseDownload, resumeDownload, startDownload } from '@/downloader'
const isDevelopment = process.env.NODE_ENV !== 'production'

let win = null
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, argv) => {
    console.log(argv)

    if (win) {
      win.webContents.send('renderer-scheme', argv[argv.length - 1])

      if (win.isMinimized()) win.restore()
      if (win.isVisible()) {
        win.focus()
      } else {
        win.show()
        win.setSkipTaskbar(false)
      }
    }
  })
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true, corsEnabled: true, supportFetchAPI: true } }
])

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      webSecurity: false,
      sandbox: false,
      webviewTag: true,
      partition: 'persist:webview'
    },
  })

  win.maximize()

  // TODO 测试
  // win.webContents.openDevTools()

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    await win.loadURL('app://./index.html')
  }

  if (process.platform === 'win32') {
    let arg = process.argv[1]

    setTimeout(() => {
      win.webContents.send('renderer-scheme', arg);
    }, 500)
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  Menu.setApplicationMenu(null)
  createWindow()

  if (app.isPackaged) {
    app.setAsDefaultProtocolClient('ncc')
  } else {
    app.setAsDefaultProtocolClient('ncc-test', process.execPath, [
      path.resolve(process.argv[1])
    ])
  }

  const filter = {
    urls: ['*://*/*'] // 拦截所有 HTTP/HTTPS 请求
  }

  session.defaultSession.webRequest.onHeadersReceived(filter, (details, callback) => {
    const headers = details.responseHeaders

    // 检查是否存在多个值的 Access-Control-Allow-Origin
    if (headers['access-control-allow-origin']) {
      const originHeader = headers['access-control-allow-origin'][0] // 假设是数组
      const origins = originHeader.split(',').map(s => s.trim())

      // 如果包含 app://.，只保留它；否则保留 *
      let singleOrigin = '*'
      if (origins.includes('app://.')) {
        singleOrigin = 'app://.'
      }

      headers['access-control-allow-origin'] = [singleOrigin]
    }

    callback({ responseHeaders: headers })
  })

  // 注册快捷键 Ctrl+Shift+I 来切换控制台
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    const focusedWin = BrowserWindow.getFocusedWindow()
    if (focusedWin) {
      // 如果控制台已打开则关闭，否则打开
      focusedWin.webContents.toggleDevTools()
    }
  })
})

app.on('will-finish-launching', () => {
  app.on('open-url', (event, url) => {
    event.preventDefault();

    if (win) {
      win.webContents.send('renderer-scheme', url);

      if (win.isMinimized()) win.restore()
      if (win.isVisible()) {
        win.focus()
      } else {
        win.show()
        win.setSkipTaskbar(false)
      }
    }
  });
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.handle('start-download', async (event, url, filename, id, token, isshenpi, shenpiData) => {
  return await startDownload(url, filename, id, token, isshenpi, shenpiData);
});

ipcMain.handle('pause-download', async (event, id) => {
  pauseDownload(id);
});

ipcMain.handle('resume-download', async (event, id) => {
  await resumeDownload(id);
});
