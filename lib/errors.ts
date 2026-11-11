export class AnalyseError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AnalyseError";
    this.status = status;
  }
}
