import { Chapter } from "../chapter";

export class MangaseeChapter extends Chapter {
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
}

