import { MangaSource } from "./manga-source";
import { Manga } from "./manga";

export class Mangasee extends MangaSource {
  protected getBaseUrl(): string {
    return "https://mangaseeonline.us";
  }

  getName(): string {
    return "Mangasee";
  }

  // TODO: implement other stuff too.
  /*
   page: 1
   keyword: berserk
   year:
   author:
   sortBy:
   sortOrder:
   status:
   pstatus:
   type:
   genre:
   genreNo:
    */
  async search(name: string, pageNumber: number): Promise<Manga[]> {
    const formData = new FormData();
    formData.set('keyword', name);
    formData.set('page', pageNumber.toString());

    console.log(await this.parseHTML(await this.postForm(`${this.getBaseUrl()}/search/request.php`, formData)));

    return [];
  }

}
