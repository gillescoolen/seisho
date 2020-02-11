// This implementation is specific to Mangasee
import { Status } from "./status";
import { HttpResource } from "../http-resource";
import { Chapter } from "./chapter";

export class Manga extends HttpResource {
  private title: string = '';
  private author: string = '';
  private description: string | null = null;
  private thumbnailUrl: string = '';

  private genres: string[] = [];

  private status: Status = Status.UNKNOWN;

  private detailsLink: string = '';

  private chapters: Chapter[] = [];

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

  public async getDetails() {
    const document = await this.getHTMLFrom(`${this.baseUri}/${this.detailsLink}`);
    const descriptionElement = document.querySelector('.description');
    this.description = descriptionElement?.textContent || null;

    this.chapters = [...document.querySelectorAll<HTMLLinkElement>('.list-group-item')].map(chapterElement => {
      const chapter = new Chapter(`${this.baseUri}/${this.removeHostNameAndPort(chapterElement.href)}`);

      const timeElement = chapterElement.querySelector<HTMLTimeElement>('.SeriesTime');

      if (timeElement?.dateTime) {
        chapter.setDate(new Date(timeElement?.dateTime));
      }

      const chapterLabelElement = chapterElement.querySelector<HTMLSpanElement>('.chapterLabel');
      chapter.setTitle(chapterLabelElement?.textContent || '');

      return chapter;
    });
  }
}
