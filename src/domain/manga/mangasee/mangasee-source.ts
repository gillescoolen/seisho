import { MangaSource } from '../manga-source';
import { Status } from '../status';
import { MangaseeManga } from './mangasee-manga';

export class MangaseeSource extends MangaSource {
  constructor() {
    super('https://mangaseeonline.us');
  }

  getName(): string {
    return 'Mangasee';
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
  // tslint:disable-next-line: max-line-length
  async search(name: string, pageNumber: number, genres: string[] = [], genresExclude: string[] = []): Promise<MangaseeManga[]> {
    const formData = new FormData();
    formData.set('keyword', name);
    formData.set('page', pageNumber.toString());
    formData.set('sortBy', 'popularity');
    formData.set('sortOrder', 'descending');

    if (genres.length > 0) {
      formData.set('genre', genres.join(','));
    }

    if (genresExclude.length > 0) {
      formData.set('genreNo', genresExclude.join(','));
    }

    const html = await this.postForm<string>(`${this.baseUri}/search/request.php`, formData);
    if (html === '') return [];
    const document = await this.parseHTML(html);

    return [...document.querySelectorAll<HTMLDivElement>('.requested')].map(requestedElement => {
      const detailElement = requestedElement.querySelector<HTMLDivElement>('div.col-xs-8');

      if (!detailElement) {
        throw new Error('Could not find the detail element');
      }

      const imageElement = requestedElement.querySelector<HTMLImageElement>('img');
      const titleElement = detailElement.querySelector<HTMLLinkElement>('a');
      const authorElement = detailElement.querySelector<HTMLLinkElement>('p:nth-child(2) > a');
      const genresElement = detailElement.querySelector<HTMLParagraphElement>('p:nth-child(5)');
      const statusElement = requestedElement.querySelector<HTMLLinkElement>('p:nth-child(3) > a:nth-child(1)');

      const manga = new MangaseeManga(this.baseUri);

      manga.setDetailsLink(this.parseUri(titleElement?.href || ''));
      manga.setTitle(titleElement?.textContent || '');
      manga.setThumbnailUrl(imageElement?.src || '');
      manga.setAuthor(authorElement?.textContent || '');
      manga.setStatus(this.parseStatus(statusElement?.textContent || ''));

      genresElement?.querySelectorAll<HTMLLinkElement>('a').forEach(genreElement => {
        const genre = genreElement.textContent;

        if (genre) {
          manga.addGenre(genre);
        }
      });

      return manga;
    });
  }

  protected parseStatus(rawStatus: string): Status {
    if (rawStatus.includes('Ongoing (Scan)')) {
      return Status.ONGOING;
    }

    if (rawStatus.includes('Complete (Scan)')) {
      return Status.COMPLETED;
    }

    return Status.UNKNOWN;
  }

  async fetchGenres(): Promise<string[]> {
    const document = await this.getHTMLFrom(`${this.baseUri}/search`);
    const genreElementList = document.querySelector('#genreCollapse > div');

    if (!genreElementList) {
      throw new Error('Could not fetch geners.');
    }

    return [...genreElementList.querySelectorAll('#genreCollapse > div > a')].map(element => {
      return element.innerHTML;
    });
  }
}
