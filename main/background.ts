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
  products: Object[]
}

const store = new Store<StoreType>({ name: 'products' })

ipcMain.on('get-products', (event) => {
  event.reply('products', store.get('products') || [])
})

ipcMain.on('add-products', (_event, arg: Object) => {
  const products = store.get('products') || []
  products.push(arg)
  store.set('products', products)
})

ipcMain.on("remove-products", (_event, arg) => {
  const products = store.get("products") || [];
  products.splice(arg, 1);
  store.set("products", products);
})

ipcMain.on('edit-products', (_event, index, request) => {
  const products = store.get('products') || []
  products[index] = request
  store.set('products', products)
})
