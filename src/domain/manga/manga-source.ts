import { Manga } from "./manga";
import axios from 'axios'

export abstract class MangaSource {
  protected abstract getBaseUrl(): string;

  public abstract getName(): string;

  public abstract async search(name: string,  pageNumber: number): Promise<Manga[]>;

  protected getClient() {
    return axios;
  }

  protected async postForm<T>(url: string, formData: FormData) {
    const response = await this.getClient().post<T>(url, formData);

    if (response.status !== 200) {
      // TODO create own error
      throw new Error("nani da fuck");
    }

    return response.data;
  }

  protected async getRawHTML(url: string): Promise<string> {
    const response = await axios.get<string>(url);

    if (response.status !== 200) {
      // TODO create own error
      throw new Error("nani da fuck");
    }

    return response.data;
  }

  protected async parseHTML(html: string): Promise<Document> {
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  }

  protected async getHTMLFrom(url: string): Promise<Document> {
    return await this.parseHTML(await this.getRawHTML(url));
  }
}
