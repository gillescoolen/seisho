import { HttpResource } from "../http-resource";

export class Chapter extends HttpResource {
  private title: string = '';

  // TODO: maybe use moment for this?
  private date: Date | null = null;

  public setTitle(title: string) {
    this.title = title;
  }

  public getTitle() {
    return this.title;
  }

  public setDate(date: Date | null) {
    this.date = date;
  }

  public getDate() {
    return this.date;
  }
  constructor(baseUri: string) {
    super(baseUri);
  }
}
