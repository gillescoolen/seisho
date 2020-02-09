import { Manga } from "./manga";
import { Status } from "./status";

export abstract class MangaSource {
  protected abstract getBaseUrl(): string;

  public abstract getName(): string;

  public abstract async search(name: string,  pageNumber: number): Promise<Manga[]>;

  protected abstract parseStatus(rawStatus: string): Status;

  protected async postForm<T>(url: string, formData: FormData) {
    const response = await fetch(url, {
      body: formData,
      method: 'post',
    });

    return await this.processResponse<T>(response);
  }

  private async processResponse<T>(response: Response): Promise<T | string> {
    if (!response.ok) {
      // TODO create own error
      throw new Error(response.statusText);
    }

    if (response.headers.get('Content-Type')?.includes('application/json')) {
      return await response.json() as T
    }

    return response.text()
  }

  protected async getRawHTML(url: string): Promise<string> {
    return this.processResponse(await fetch(url));
  }

  protected async parseHTML(html: string): Promise<Document> {
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  }

  protected async getHTMLFrom(url: string): Promise<Document> {
    return await this.parseHTML(await this.getRawHTML(url));
  }
}
