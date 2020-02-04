// This implementation is specific to Mangasee
export class Manga {
  private artist: string = '';
  private title: string = '';
  private author: string = '';
  private description: string | null = null;
  private thumbnailUrl: string = '';

  public getArtist(): string {
    return this.artist;
  }

  public setArtist(value: string) {
    this.artist = value;
  }

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
}
