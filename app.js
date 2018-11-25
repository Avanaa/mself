const { app, BrowserWindow, ipcMain } = require('electron');

const index = 'views/feed.html';
const cardapio = 'views/cardapio.html';
const novo_item = 'views/formulario.html';

const path = require('path');

let mainWindow;

app.on('ready', createWindow);

function createWindow(){

    mainWindow = new BrowserWindow({
        width : 800,
        height : 600
    });

    mainWindow.loadFile(path.join(__dirname, index));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
  
app.on('activate', () => {
    if (win === null) {createWindow}
});

ipcMain.on('inicio', () => {
    mainWindow.loadFile(path.join(__dirname, index));
});

ipcMain.on('abrir-novo', () => {
    mainWindow.loadFile(path.join(__dirname, novo_item));
});

ipcMain.on('abrir-cardapio', () => {
    mainWindow.loadFile(path.join(__dirname, cardapio));
});

ipcMain.on('editar-item', (e, params) =>{
    //mainWindow.loadFile(path.join(__dirname));
});