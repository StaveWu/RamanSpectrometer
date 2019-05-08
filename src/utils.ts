
export class Series {
  name: string;
  data: Array<number> | Array<Array<number>>;
  constructor(name: string, data: Array<number> | Array<Array<number>>) {
    this.name = name;
    this.data = data;
  }
}

export interface Pipeline {
  method: string,
  params: any,
}

export interface PureComponent {
  name: string;
  formula: string;
  data: number[][];
  state: string;
}