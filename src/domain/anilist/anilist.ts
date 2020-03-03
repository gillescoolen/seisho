// import express from 'express';
import electron from 'electron';
import * as http from 'http';
import * as url from 'url';

export class Anilist {
  login() {
    const BrowserWindow = electron.remote.BrowserWindow;
    let authWindow: electron.BrowserWindow | null = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      webPreferences: { nodeIntegration: false }
    });

    http.createServer( (req, res) => {
      console.log(url.parse(req.url!));
      res.end("Success");
    }).listen(8000);

    authWindow.loadURL(`https://anilist.co/api/v2/oauth/authorize?client_id=3223&response_type=token`);

    authWindow.show();

    authWindow.on('did-fail-load', () => {
      console.log(authWindow?.webContents.getURL());
    })
    //
    // // const ipcMain = electron.ipcMain;
    //
    // authWindow.webContents.on('did-finish-load', () => {
    //   electron.ipcRenderer.send('done', `This message goes back to the main window.`);
    // });
    // electron.ipcMain.on('done', (message: string) => {
    //   console.log(message)
    // });
    // authWindow.on('closed', () => {
    //   authWindow = null;
    // });

  }
// // Build the OAuth consent page URL
//     const BrowserWindow = electron.remote.BrowserWindow;
//     let authWindow: electron.BrowserWindow | null = new BrowserWindow({
//       width: 800,
//       height: 600,
//       show: false,
//       webPreferences: { nodeIntegration: false }
//     });
//
//     authWindow.loadURL(`https://anilist.co/api/v2/oauth/authorize?client_id=3223&response_type=token`);
//
//     authWindow.show();
//
//     const handleCallback = (url: string) => {
//       console.log(url);
//       const raw_code = /code=([^&]*)/.exec(url) || null;
//       const code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
//       const error = /\?error=(.+)$/.exec(url);
//
//       if (code || error) {
//         // Close the browser if code found or error
//         // @ts-ignore
//         authWindow.destroy();
//       }
//
//       // If there is a code, proceed to get token from github
//       if (code) {
//         this.requestGithubToken(code);
//       } else if (error) {
//         alert('Oops! Something went wrong and we couldn\'t' +
//           'log you in using Github. Please try again.');
//       }
//     };
//
// // Handle the response from GitHub - See Update from 4/12/2015
//
//     // @ts-ignore
//     authWindow.webContents.on('will-redirect',  (event, url) =>{
//       console.log('will-redirect');
//       console.log(url);
//       handleCallback(url);
//     });
//
//     // @ts-ignore
//     authWindow.webContents.on('did-start-navigation',  (event, url: string) => {
//       console.log(url);
//       console.log('did-start-navigation');
//       handleCallback(url);
//     });
//
//     // @ts-ignore
//     authWindow.webContents.on('did-get-redirect-request',  (event, oldUrl, newUrl) => {
//       console.log('did-get-redirect-request');
//       handleCallback(newUrl);
//     });
//
// // Reset the authWindow on close
//     authWindow.on('close', () => authWindow = null);
//   }
//
//   private requestGithubToken(code: any) {
//     console.log(code);
//   }
}
