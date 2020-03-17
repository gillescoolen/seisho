import { HttpResource } from './http-resource';

export abstract class Chapter extends HttpResource {
  private title: string = '';

  private date: Date = new Date();

  protected firstPage: number = 0;
  protected lastPage: number = 0;

  protected currentPage: number = 0;

  protected pages: string[] = [];
  protected fetchedPages: HTMLImageElement[] = [];

  public getCurrentPage() {
    const page = this.pages[this.currentPage];
    const fetchedPage = this.fetchedPages[this.currentPage];

    return (fetchedPage) ? fetchedPage.src : page;
  }

  public getCurrentPageNumber() {
    return this.currentPage;
  }

  public completed() {
    return this.pages.length !== 0 && this.currentPage === this.pages.length;
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

  public startFromLastPage() {
    this.currentPage = this.lastPage;
  }

  public hasFetched(): boolean {
    return this.firstPage !== 0 && this.lastPage !== 0;
  }

  public hasPrefetched(): boolean {
    return this.fetchedPages.length > 1;
  }

  public hasFinished(): boolean {
    return this.currentPage === this.pages.length && this.pages.length !== 0;
  }

  public prefetchPages() {
    if (this.fetchedPages.length >= this.pages.length) return;

    this.pages.forEach(page => {
      const fetchedPage = new Image();
      fetchedPage.src = page;

      this.fetchedPages.push(fetchedPage);
    });
  }
}
