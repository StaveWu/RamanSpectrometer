export class Series {
  name: string;
  data: Array<number>;
  constructor(name: string, data: Array<number>) {
    this.name = name;
    this.data = data;
  }
}