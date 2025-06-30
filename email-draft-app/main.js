const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('create-eml', async (event, data) => {
  const { to, subject, body, filePath, fileName, fileBase64 } = data;
  const boundary = "boundary42";

  const eml = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    ``,
    `${body}`,
    ``,
    `--${boundary}`,
    `Content-Type: application/octet-stream; name="${fileName}"`,
    `Content-Disposition: attachment; filename="${fileName}"`,
    `Content-Transfer-Encoding: base64`,
    ``,
    `${fileBase64}`,
    `--${boundary}--`
  ].join('\r\n');

  const emlPath = path.join(app.getPath('desktop'), 'draft.eml');
  fs.writeFileSync(emlPath, eml, 'utf8');
  shell.openPath(emlPath); // פותח אוטומטית את הקובץ באאוטלוק
});
