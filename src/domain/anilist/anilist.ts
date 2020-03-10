import electron from 'electron';

export class Anilist {
  private accessToken = '';

  private static readonly ANILIST_PERSIST_KEY = 'anilist-accesstoken';

  constructor() {
    const accessToken = localStorage.getItem(Anilist.ANILIST_PERSIST_KEY);

    if (accessToken) {
      this.accessToken = accessToken;
    }
  }

  public login(): Promise<void> {
    return new Promise((resolve, reject) => {
      let authWindow: electron.BrowserWindow | null = new electron.remote.BrowserWindow({
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
          try {
            this.processAccessToken(url);
            resolve();
          } catch (e) {
            reject(e);
          }
        }
      });

      authWindow.loadURL(`https://anilist.co/api/v2/oauth/authorize?client_id=3223&response_type=token`);

      authWindow.show();

      authWindow.on('closed', () => {
        authWindow = null;
      });
    });
  }

  private processAccessToken(urlWithToken: string) {
    this.accessToken = this.extractAccessTokenFromUrl(urlWithToken);
    this.persistAccessToken(this.accessToken);
  }

  private persistAccessToken(token: string) {
    localStorage.setItem(Anilist.ANILIST_PERSIST_KEY, token);
  }

  private extractAccessTokenFromUrl(urlWithToken: string): string {
    const result = /(?<=access_token=).+?(?=&)/.exec(urlWithToken);

    if (!result) {
      throw new Error('Could extract token from url.');
    }

    return result[0];
  }
}
