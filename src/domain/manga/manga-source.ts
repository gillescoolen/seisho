import { Status } from './status';
import { HttpResource } from './http-resource';
import { Manga } from './manga';

export abstract class MangaSource extends HttpResource {
  public abstract getName(): string;

  public abstract async search(name: string, pageNumber: number, genres: string[], genresExclude: string[]): Promise<Manga[]>;

  public abstract async fetchGenres(): Promise<string[]>;

  protected abstract parseStatus(rawStatus: string): Status;
}
