import { Manga } from "./manga";
import { Status } from "./status";
import { HttpResource } from "./http-resource";

export abstract class MangaSource extends HttpResource {
  public abstract getName(): string;

  public abstract async search(name: string, pageNumber: number): Promise<Manga[]>;

  protected abstract parseStatus(rawStatus: string): Status;
}
