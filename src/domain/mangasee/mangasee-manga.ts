import { Manga } from "../manga";
import { MangaseeChapter } from "./mangasee-chapter";

export class MangaseeManga extends Manga {
  public async fetchDetails() {
    const document = await this.getHTMLFrom(`${this.baseUri}/${this.detailsLink}`);
    const descriptionElement = document.querySelector('.description');
    this.description = descriptionElement?.textContent || null;

    this.chapters = [...document.querySelectorAll<HTMLLinkElement>('.list-group-item')]
      .map(chapterElement => this.buildChapter(chapterElement));
  }

  private buildChapter(chapterElement: HTMLLinkElement): MangaseeChapter {
    const chapter = new MangaseeChapter(`${this.baseUri}/${this.parseUri(chapterElement.href)}`);

    const timeElement = chapterElement.querySelector<HTMLTimeElement>('.SeriesTime');

    if (timeElement?.dateTime) {
      chapter.setDate(new Date(timeElement.dateTime));
    }

    const chapterLabelElement = chapterElement.querySelector<HTMLSpanElement>('.chapterLabel');
    chapter.setTitle(chapterLabelElement?.textContent || 'No title');

    return chapter;
  }
}
