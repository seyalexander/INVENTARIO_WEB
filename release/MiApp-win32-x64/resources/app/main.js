const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

app.whenReady().then(() => {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false
        }
    });

    // Detecta si está en modo desarrollo o producción
    const isDev = !app.isPackaged;

    // Construye la ruta correcta según el entorno
    const filePath = isDev
    ? path.join(__dirname, 'dist', 'db-inventory-gestor', 'browser', 'index.html')
    : path.join(process.resourcesPath, 'app', 'dist', 'db-inventory-gestor', 'browser', 'index.html');


    // Cargar el archivo HTML
    win.loadFile(filePath).catch(err => {
        console.error("Error al cargar el archivo HTML:", err);
    });

    // Abre DevTools en desarrollo
    if (isDev) {
        win.webContents.openDevTools();
    }

    win.on('closed', () => {
        win = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
