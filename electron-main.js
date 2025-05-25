const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let djangoProcess = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
    },
  });

  win.loadURL('http://localhost:8000');
}

app.whenReady().then(() => {
  djangoProcess = spawn('python', ['manage.py', 'runserver'], {
    cwd: __dirname,
    shell: true,
  });

  djangoProcess.stdout.on('data', data => console.log(`[Django]: ${data}`));
  djangoProcess.stderr.on('data', data => console.error(`[Django Error]: ${data}`));

  createWindow();
});

app.on('window-all-closed', () => {
  if (djangoProcess) djangoProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});