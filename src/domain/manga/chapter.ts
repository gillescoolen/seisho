import { HttpResource } from "./http-resource";

export abstract class Chapter extends HttpResource {
  private title: string = '';

  private date: Date = new Date();

  protected firstPage: number = 0;
  protected lastPage: number = 0;

  protected currentPage: number = 1;

  protected pages: string[] = [];

  public getCurrentPage() {
    return this.pages[this.currentPage];
  }

  public setTitle(title: string) {
    this.title = title;
  }

  public getTitle() {
    return this.title;
  }

  public setDate(date: Date) {
    this.date = date;
  }

  public getDate() {
    return this.date;
  }

  constructor(baseUri: string) {
    super(baseUri);
  }

  public abstract async fetch(): Promise<void>;

  public nextPage() {
    if (!this.hasFetched()) {
      throw new Error('Cannot paginate on a chapter that was not fetched.');
    }

    this.currentPage++;
  }

  public previousPage() {
    if (!this.hasFetched()) {
      throw new Error('Cannot paginate on a chapter that was not fetched.');
    }

    this.currentPage--;
  }

  private hasFetched(): boolean {
    return this.firstPage !== 0 && this.lastPage !== 0;
  }
}
