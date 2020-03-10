import { Status } from './status';
import { HttpResource } from './http-resource';
import { Chapter } from './chapter';
import { MediaListStatus } from '../anilist/types';
import { AniList } from '../anilist/anilist';

export abstract class Manga extends HttpResource {
  private title: string = '';
  private author: string = '';
  protected description: string | null = null;
  private thumbnailUrl: string = '';

  private genres: string[] = [];
  private status: Status = Status.UNKNOWN;
  protected detailsLink: string = '';
  protected chapters: Chapter[] = [];

  protected trackingInfo: TrackingInfo = {
    mediaId: 0,
    personalTrackerMediaId: 0,
    score: 0,
    status: MediaListStatus.PLANNING
  };

  private tracker: AniList | null = null;

  public setTracker(tracker: AniList | null) {
    this.tracker = tracker;
  }

  private currentChapter: number = 0;

  public getProgress() {
    return this.currentChapter;
  }

  public getTitle(): string {
    return this.title;
  }

  public setTrackerMediaId(mediaId: number) {
    if (!this.tracker) {
      this.throwNotrackerError();
    }

    this.trackingInfo.mediaId = mediaId;

    this.persist();
  }

  public getTrackerMediaId() {
    if (!this.tracker) {
      this.throwNotrackerError();
    }

    return this.trackingInfo.mediaId;
  }

  public setScore(score: number) {
    if (!this.tracker) {
      this.throwNotrackerError();
    }

    this.trackingInfo.score = score;

    this.persist();
  }

  public getScore() {
    return this.trackingInfo.score;
  }

  public setTitle(value: string) {
    this.title = value;
  }

  public setTrackingStatus(trackingStatus: MediaListStatus) {
    if (!this.tracker) {
      this.throwNotrackerError();
    }

    this.trackingInfo.status = trackingStatus;

    this.persist();
  }

  public getTrackingStatus() {
    if (!this.tracker) {
      this.throwNotrackerError();
    }

    return this.trackingInfo.status;
  }

  public getAuthor(): string {
    return this.author;
  }

  public setAuthor(value: string) {
    this.author = value;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public getThumbnailUrl(): string {
    return this.thumbnailUrl;
  }

  public setThumbnailUrl(value: string) {
    this.thumbnailUrl = value;
  }

  public getGenres() {
    return this.genres;
  }

  public addGenre(genre: string) {
    this.genres.push(genre);
  }

  public setStatus(status: Status) {
    this.status = status;
  }

  public getStatus() {
    return this.status;
  }

  public getDetailsLink(): string {
    return this.detailsLink;
  }

  public setDetailsLink(link: string) {
    this.detailsLink = link;
  }

  public getChapters() {
    return this.chapters;
  }

  constructor(baseUri: string) {
    super(baseUri);
  }

  public abstract async fetchDetails(): Promise<void>;

  public persistTrackerInfo(info: TrackingInfo) {
    const persistedManga: PersistedManga = {
      progress: this.currentChapter,
      trackingInfo: info
    };
    localStorage.setItem(this.title, JSON.stringify(persistedManga));
  }

  protected recover() {
    const rawManga = localStorage.getItem(this.title);

    if (rawManga) {
      const manga = JSON.parse(rawManga) as PersistedManga;

      this.trackingInfo.personalTrackerMediaId = manga.trackingInfo.personalTrackerMediaId;
      this.trackingInfo.mediaId = manga.trackingInfo.mediaId;
      this.trackingInfo.score = manga.trackingInfo.score;
      this.trackingInfo.status = manga.trackingInfo.status;
      this.currentChapter = manga.progress;
    }
  }

  private persist() {
    const rawManga = localStorage.getItem(this.title);

    if (rawManga) {
      const manga = JSON.parse(rawManga) as PersistedManga;
      manga.progress = this.currentChapter;
      manga.trackingInfo = this.trackingInfo;
      localStorage.setItem(this.title, JSON.stringify(manga));
    }
  }

  public getCurrentChapter() {
    return this.chapters[this.currentChapter];
  }

  public nextChapter() {
    if (this.chapters.length === 0) {
      throw new Error('Cannot paginate on that has no chapters');
    }

    this.currentChapter++;
    this.persist();
  }

  public previousChapter() {
    if (this.chapters.length === 0) {
      throw new Error('Cannot paginate on that has no chapters');
    }

    this.currentChapter--;
    this.persist();
  }

  public async sync() {
    await this.tracker?.updateEntry(this, {
      progress: this.getProgress(),
      scoreRaw: this.getScore(),
      status: this.getTrackingStatus()
    });
  }

  private throwNotrackerError() {
    throw new Error('Bind a tracker first');
  }
}

export interface PersistedManga {
  progress: number;
  trackingInfo: TrackingInfo;
}

export interface TrackingInfo {
  mediaId: number;
  personalTrackerMediaId: number;
  score: number;
  status: MediaListStatus;
}