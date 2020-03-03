import electron from 'electron';

export class Anilist {
  login() {
    const BrowserWindow = electron.remote.BrowserWindow;

    let authWindow: electron.BrowserWindow | null = new BrowserWindow({
      width: 800,
      height: 600,
      modal: true,
      parent: electron.remote.getCurrentWindow(),
      show: false,
    });
    authWindow.webContents.on('dom-ready', () => {
      if (!authWindow) {
        return;
      }

      const url = authWindow.webContents.getURL();

      if (url.includes("pin")) {
        authWindow.close();
        this.parseToken(url);
      }
    });

    authWindow.loadURL(`https://anilist.co/api/v2/oauth/authorize?client_id=3223&response_type=token`);

    authWindow.show();

    authWindow.on('closed', () => {
      authWindow = null;
    });
  }

  private parseToken(urlWithToken: string) {
    console.log(this.extractTokenFromUrl(urlWithToken))
  }

  private extractTokenFromUrl(urlWithToken: string): string {
    const result = /(?<=access_token=).+?(?=&)/.exec(urlWithToken);

    if (!result) {
      throw new Error('Could extract token from url.');
    }

    return result[0];
  }
}
