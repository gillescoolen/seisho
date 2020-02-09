// This implementation is specific to Mangasee
import { Status } from "./status";

export class Manga {
  private title: string = '';
  private author: string = '';
  private description: string | null = null;
  private thumbnailUrl: string = '';

  private genres: string[] = [];

  private status: Status = Status.createDefault();

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

  public setDescription(value: string | null) {
    this.description = value;
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
}
