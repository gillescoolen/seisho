import { HttpResource } from '../http-resource';
export class Chapter extends HttpResource {
  private title: string = '';

  private date: Date = new Date();

  private firstPage: number = 0;
  private lastPage: number = 0;

  private currentPage: number = 1;

  private pages: string[] = [];

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

  public async fetch() {
    const document = await this.getHTMLFrom(this.baseUri);

    const imageElement = document.querySelector<HTMLImageElement>('.CurImage');
    const pageSelectElement = document.querySelector<HTMLSelectElement>('.PageSelect');

    if (!pageSelectElement || !imageElement) {
      throw new Error('Could not fetch the chapter');
    }

    const firstPageElement = pageSelectElement.children.item(0) as HTMLOptionElement;
    const lastPageElement = pageSelectElement.children.item(pageSelectElement.children.length - 1) as HTMLOptionElement;

    this.firstPage = +firstPageElement.value;
    this.lastPage = +lastPageElement.value;

    for (let i = 1; i <= this.lastPage; i++) {
      let pageNumberAsString = '';
      if (i < 10) {
        pageNumberAsString = '00';
      } else if (i < 100) {
        pageNumberAsString = '0'
      }

      const image =  imageElement.src.replace(/[0-9]+(?!.*[0-9])/, pageNumberAsString + i.toString());
      this.pages.push(image);
    }
  }

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
