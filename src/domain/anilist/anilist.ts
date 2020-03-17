import electron from 'electron';
import { AniListSearchParams, AniListSearchResponse, AniListUser, SaveMediaListEntry } from './types';
import { Manga } from '../manga/manga';

export class AniList {
  private accessToken = '';

  private static readonly ANILIST_PERSIST_KEY = 'anilist-accesstoken';
  private static readonly ANILIST_USER_PERSIST_KEY = 'anilist-user';

  private readonly baseUrl = 'https://graphql.anilist.co';

  private readonly currentUser: AniListUser | null = null;

  public getCurrentUser() {
    return this.currentUser;
  }

  constructor() {
    const accessToken = localStorage.getItem(AniList.ANILIST_PERSIST_KEY);
    const user = localStorage.getItem(AniList.ANILIST_USER_PERSIST_KEY);

    if (accessToken) {
      this.accessToken = accessToken;
    }

    if (user) {
      this.currentUser = JSON.parse(user) as AniListUser;
    }
  }

  public login(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let authWindow: electron.BrowserWindow | null = new electron.remote.BrowserWindow({
        width: 800,
        height: 600,
        modal: true,
        parent: electron.remote.getCurrentWindow(),
        show: false
      });

      authWindow.webContents.on('dom-ready', async () => {
        if (!authWindow) {
          return;
        }

        const url = authWindow.webContents.getURL();

        if (url.includes('pin')) {
          authWindow.close();
          try {
            this.processAccessToken(url);
            await this.getUserData();
            resolve();
          } catch (e) {
            reject(e);
          }
        }
      });

      authWindow.loadURL(`https://anilist.co/api/v2/oauth/authorize?client_id=3245&response_type=token`);

      authWindow.show();

      authWindow.on('closed', () => {
        authWindow = null;
      });
    });
  }

  private async getUserData() {
    const query = `
        {
          Data: Viewer {
            id
            name
            avatar {
              large
            }
          }
        }`.trim();

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    const user = (await response.json()).data.Data as AniListUser;
    localStorage.setItem(AniList.ANILIST_USER_PERSIST_KEY, JSON.stringify(user));
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
          media (id: $id, search: $search, type: MANGA, format_not_in: [NOVEL]) {
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
    `.trim();

    const variables: AniListSearchParams = {
      search: name,
      page: pageNumber,
      perPage: 50
    };

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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

  public async createEntry(manga: Manga, entryData: Partial<SaveMediaListEntry>) {
    return this.updateEntry(manga, entryData);
  }

  public async updateEntry(manga: Manga, entryData: Partial<SaveMediaListEntry>) {
    const query = `
      mutation ($mediaId: Int, $status: MediaListStatus, $scoreRaw: Int, $progress: Int) {
        SaveMediaListEntry (mediaId: $mediaId, status: $status, scoreRaw: $scoreRaw, progress: $progress) {
          id
          status
          score(format: POINT_100)
        }
      }`;

    const variables: Partial<SaveMediaListEntry> = {
      mediaId: manga.getTrackerMediaId(),
      ...entryData
    };

    const response = await fetch(this.baseUrl, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query, variables }),
      method: 'post'
    });

    if (!response.ok) {
      // TODO: send different errors on different scenarios
      throw new Error('Something went wrong');
    }

    const saveMediaListEntry = (await response.json()).data.SaveMediaListEntry as Partial<SaveMediaListEntry>;

    manga.recoverFromTracker({
      trackingInfo: {
        mediaId: variables!.mediaId!,
        personalTrackerMediaId: saveMediaListEntry!.id!,
        score: saveMediaListEntry!.score!,
        status: saveMediaListEntry!.status!
      }
    });
  }

  public async retrieveEntry(manga: Manga) {
    const query = `
      query ($mediaId: Int, $id: Int) {
        Page {
          mediaList (mediaId: $mediaId, id: $id) {
            id
            status
            score(format: POINT_100)
            progress
          }
        }
      }`;

    const variables = {
      id: manga.getPersonalMediaId(),
      mediaId: manga.getTrackerMediaId()
    };

    const response = await fetch(this.baseUrl, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query, variables }),
      method: 'post'
    });

    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    const saveMediaListEntry = (await response.json()).data.Page.mediaList[0] as Partial<SaveMediaListEntry>;
    const progress = (saveMediaListEntry.progress && saveMediaListEntry.progress > manga.getProgress())
      ? saveMediaListEntry.progress
      : manga.getProgress();

    manga.recoverFromTracker({
      progress,
      trackingInfo: {
        mediaId: variables!.mediaId!,
        personalTrackerMediaId: saveMediaListEntry!.id!,
        score: saveMediaListEntry!.score!,
        status: saveMediaListEntry!.status!
      }
    });
  }
}
