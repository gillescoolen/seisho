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

  private unread = true;

  public isUnread() {
    return this.unread;
  }

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

  public tracking() {
    return this.trackingInfo.mediaId !== 0;
  }

  public getTrackerMediaId() {
    if (!this.tracker) {
      this.throwNotrackerError();
    }

    return this.trackingInfo.mediaId;
  }

  public getPersonalMediaId() {
    return this.trackingInfo.personalTrackerMediaId;
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

  // TODO: refactor this
  protected recover() {
    const rawManga = localStorage.getItem(this.title);
    if (rawManga) {
      const manga = JSON.parse(rawManga) as PersistedManga;
      if (manga.trackingInfo && manga.trackingInfo.personalTrackerMediaId && manga.trackingInfo.mediaId) {
        this.trackingInfo.personalTrackerMediaId = manga.trackingInfo.personalTrackerMediaId;
        this.trackingInfo.mediaId = manga.trackingInfo.mediaId;
        this.trackingInfo.score = manga.trackingInfo.score;
        this.trackingInfo.status = manga.trackingInfo.status;
      }

      this.currentChapter = manga.progress;
      this.unread = false;
    }
  }

  // TODO: refactor this function
  private persist() {
    if (this.trackingInfo.mediaId === 0 && this.trackingInfo.personalTrackerMediaId === 0) {
      const data: Partial<PersistedManga> = {
        progress: this.getProgress()
      };
      localStorage.setItem(this.title, JSON.stringify(data));
    } else {
      const data: PersistedManga = {
        progress: this.getProgress(),
        trackingInfo: this.trackingInfo
      };
      localStorage.setItem(this.title, JSON.stringify(data));
    }
  }

  public getCurrentChapter() {
    return this.chapters[this.currentChapter];
  }

  public setCurrentChapter(chapter: Chapter) {
    this.currentChapter = this.chapters.findIndex(c => c.getTitle() === chapter.getTitle());
  }

  public setFinished() {
    this.currentChapter = 0;
    this.persist();
  }

  public hasNextChapter() {
    return this.currentChapter < this.chapters.length + 1;
  }

  public hasPreviousChapter() {
    return this.currentChapter !== 0;
  }

  public nextChapter() {
    if (this.chapters.length === 0) throw new Error('Cannot paginate on that has no chapters');

    if (this.currentChapter === this.chapters.length) return;

    this.currentChapter++;
    this.persist();
  }

  public previousChapter() {
    if (this.chapters.length === 0) throw new Error('Cannot paginate on that has no chapters');

    if (this.currentChapter === 0) return;

    this.currentChapter--;
    this.persist();
  }

  public async syncToTracker() {
    await this.tracker?.updateEntry(this, {
      progress: this.getProgress(),
      scoreRaw: this.getScore(),
      status: this.getTrackingStatus()
    });
  }

  public async syncFromTracker() {
    await this.tracker?.retrieveEntry(this);
  }

  private throwNotrackerError() {
    throw new Error('Bind a tracker first');
  }

  recoverFromTracker(persistedManga: Partial<PersistedManga>) {
    const progress = persistedManga.progress;

    if (progress) {
      this.currentChapter = progress;
    }
    this.trackingInfo = persistedManga!.trackingInfo!;

    this.persist();
  }
}

export interface PersistedManga {
  progress: number;
  trackingInfo: TrackingInfo;
}

export interface TrackingInfo {
  mediaId: number;
  personalTrackerMediaId: number;
  score?: number;
  status: MediaListStatus;
}