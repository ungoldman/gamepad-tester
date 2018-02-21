const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

require('electron-context-menu')()

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    backgroundColor: '#000',
    darkTheme: true,
    width: 1000,
    height: 400,
    minWidth: 800,
    minHeight: 200,
    acceptFirstMouse: true
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
