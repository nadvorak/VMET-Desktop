const { app, BrowserWindow } = require('electron')

const path = require('path')
const url = require('url')
const nativeImage = require('electron').nativeImage
const { ipcMain } = require('electron');

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "OPUS",
    icon: path.join(__dirname, '/../icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      devTools: false
    }
  })

  mainWindow.setMenuBarVisibility(false)
  // Windows specific

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, '/../index.html'),
        protocol: 'file:',
        slashes: true
      })
  )

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// ------------------- set up event listeners here --------------------
// temporary variable to store data while background
// process is ready to start processing
let cache = {
	data: undefined,
};

// a window object outside the function scope prevents
// the object from being garbage collected
let hiddenWindow;

// This event listener will listen for request 
// from visible renderer process
ipcMain.on('START_BACKGROUND_VIA_MAIN', (event, args) => {
    /* ---- Code to execute as callback ---- */
    console.log('start background');
    const backgroundFileUrl = url.format({
		pathname: path.join(__dirname, './background.html'),
		protocol: 'file:',
		slashes: true,
	});
	hiddenWindow = new BrowserWindow({
    show: false,
    // Hide this window for realse
    width: 800,
    height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
	});
	hiddenWindow.loadURL(backgroundFileUrl);

	hiddenWindow.webContents.openDevTools();

	hiddenWindow.on('closed', () => {
		hiddenWindow = null;
	});

	cache.data = args.number;
});

// This event listener will listen for data being sent back 
// from the background renderer process
ipcMain.on('MESSAGE_FROM_BACKGROUND', (event, args) => {
    /* ---- Code to execute as callback ---- */
    mainWindow.webContents.send('MESSAGE_FROM_BACKGROUND_VIA_MAIN', args.message);
});

ipcMain.on('BACKGROUND_READY', (event, args) => {

	event.reply('START_PROCESSING', {
		data: cache.data,
	});
});