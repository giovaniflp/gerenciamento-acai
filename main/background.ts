import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import Store from 'electron-store'
import { createWindow } from './helpers'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

type StoreType = {
  messages: string[]
}

const store = new Store<StoreType>({ name: 'messages' })

ipcMain.on('get-messages', (event) => {
  event.reply('messages', store.get('messages') || [])
})

ipcMain.on('add-message', (_event, arg) => {
  const messages = store.get('messages') || []
  messages.push(arg)
  store.set('messages', messages)
})

ipcMain.on("remove-message", (_event, arg) => {
  const messages = store.get("messages") || [];
  messages.splice(arg, 1);
  store.set("messages", messages);
})
