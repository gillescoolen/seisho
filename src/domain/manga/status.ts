export class Status {
  private readonly value: StatusEnum = StatusEnum.UNKNOWN;

  public getValue() {
    return this.value;
  }

  private constructor(status: StatusEnum) {
    this.value = status;
  }

  public static fromMangaSee(status: string): Status {
    if (status.includes('Ongoing (Scan)')) {
      return new this(StatusEnum.ONGOING);
    }

    if (status.includes('Complete (Scan)')) {
      return new this(StatusEnum.COMPLETED);
    }

    return this.createDefault();
  }

  public static createDefault() {
    return new this(StatusEnum.UNKNOWN);
  }
}

enum StatusEnum {
  UNKNOWN = 'Unknown',
  ONGOING = 'Ongoing',
  COMPLETED = 'Completed'
}
