import electron from 'electron';
import { AniListSearchParams, AniListSearchResponse } from './types';

export class AniList {
  private accessToken = '';

  private static readonly ANILIST_PERSIST_KEY = 'anilist-accesstoken';
  private readonly baseUrl = 'https://graphql.anilist.co';

  constructor() {
    const accessToken = localStorage.getItem(AniList.ANILIST_PERSIST_KEY);

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

  public async search(name: string, pageNumber: number): Promise<AniListSearchResponse> {
    const query = `
query ($id: Int, $page: Int, $perPage: Int, $search: String) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media (id: $id, search: $search, type: MANGA) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
      }
      type
      status
      chapters
      description
      startDate {
        year
        month
        day
      }
    }
  }
}
`;

    const variables: AniListSearchParams = {
      search: name,
      page: pageNumber,
      perPage: 50
    };

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
      // TODO: send different errors on different scenarios
      throw new Error('Something went wrong');
    }

    return (await response.json()).data.Page as AniListSearchResponse;
  }

  private processAccessToken(urlWithToken: string) {
    this.accessToken = this.extractAccessTokenFromUrl(urlWithToken);
    this.persistAccessToken(this.accessToken);
  }

  private persistAccessToken(token: string) {
    localStorage.setItem(AniList.ANILIST_PERSIST_KEY, token);
  }

  private extractAccessTokenFromUrl(urlWithToken: string): string {
    const result = /(?<=access_token=).+?(?=&)/.exec(urlWithToken);

    if (!result) {
      throw new Error('Could extract token from url.');
    }

    return result[0];
  }
}
