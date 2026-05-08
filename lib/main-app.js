const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const ipc = electron.ipcMain
// electron.crashReporter.start()
const singleInstance = app.requestSingleInstanceLock()

var ipcServer = null

var mainWindow = null

// Single Instance Lock
if (!singleInstance) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, it should focus the existing instance.
    if (mainWindow) {
      if (!mainWindow.isVisible()) mainWindow.show()
      mainWindow.focus()
    }
  })
}

// Auto-update is disabled — this build does not point to a release feed.
ipc.on('update-check', function() {
  if (mainWindow != null) {
    mainWindow.webContents.send(
      'update-not-found',
      'Auto-update is disabled in this build.'
    )
  }
})

ipc.on('update-app-confirm', function() {})
ipc.on('update-cancel', function() {})
ipc.on('update-download-confirm', function() {})

app.on('window-all-closed', function() {
  app.quit()
})

app.on('ready', function() {
  mainWindow = require('./main-window')

  var template = require('./main-menu')
  var menu = Menu.buildFromTemplate(template)
  var touchBarMenu = require('./touchbar-menu')
  switch (process.platform) {
    case 'darwin':
      Menu.setApplicationMenu(menu)
      mainWindow.setTouchBar(touchBarMenu)
      break
    case 'win32':
      mainWindow.setMenu(menu)
      break
    case 'linux':
      Menu.setApplicationMenu(menu)
      mainWindow.setMenu(menu)
  }

  ipcServer = require('./ipcServer')
  ipcServer.server.start()
})

module.exports = app
