import { Status } from "./status";
import { HttpResource } from "./http-resource";
import { Chapter } from "./chapter";

export abstract class Manga extends HttpResource {
  private title: string = '';
  private author: string = '';
  protected description: string | null = null;
  private thumbnailUrl: string = '';

  private genres: string[] = [];
  private status: Status = Status.UNKNOWN;
  protected detailsLink: string = '';
  protected chapters: Chapter[] = [];

  public getTitle(): string {
    return this.title;
  }

  public setTitle(value: string) {
    this.title = value;
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
}
