import { Status } from "./status";
import { HttpResource } from "./http-resource";
import { Manga } from './manga';

export abstract class MangaSource extends HttpResource {
  public abstract getName(): string;

  public abstract async search(name: string, pageNumber: number): Promise<Manga[]>;

  protected abstract parseStatus(rawStatus: string): Status;
}
