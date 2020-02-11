import { MangaSource } from './manga/manga-source';
import { Manga } from './manga/manga';
import { Status } from './manga/status';

export class Mangasee extends MangaSource {
  constructor() {
    super('https://mangaseeonline.us');
  }

  getName(): string {
    return 'Mangasee';
  }

  /**
   * page: 1
   * keyword: berserk
   * year:
   * author:
   * sortBy:
   * sortOrder:
   * status:
   * pstatus:
   * type:
   * genre:
   * genreNo:
   * @param name 
   * @param pageNumber 
   * TODO: implement other stuff too.
   */
  async search(name: string, pageNumber: number): Promise<Manga[]> {
    const formData = new FormData();
    formData.set('keyword', name);
    formData.set('page', pageNumber.toString());

    const html = await this.postForm<string>(`${this.baseUri}/search/request.php`, formData);
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

      const manga = new Manga(this.baseUri);
      manga.setDetailsLink(this.removeHostNameAndPort(titleElement?.href || ''));
      manga.setTitle(titleElement?.textContent || '');
      manga.setThumbnailUrl(imageElement?.src || '');
      manga.setAuthor(authorElement?.textContent || '');
      manga.setStatus(this.parseStatus(statusElement?.textContent || ''));

      genresElement?.querySelectorAll<HTMLLinkElement>('a').forEach(genreElement => {
        const genre = genreElement.textContent;

        if (genre) {
          manga.addGenre(genre)
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
}
