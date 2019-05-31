import path from 'path';

export class SpectrumDO {
  public static EMPTY: SpectrumDO = new SpectrumDO('', []);

  constructor(public name:string, public data:number[][], public id?: number) {}

  static fromJson(json: any): SpectrumDO {
    return new SpectrumDO(json.name, json.data, json.id);
  }

  toJson() {
    return Object.assign({}, this);
  }

  static fromFile(pathname: string, data: any) {
    let name = path.parse(pathname).name;
    let points = new Array<Array<number>>();
    data
      .toString()
      .trim()
      .split("\n")
      .map((line: any) => {
        let s = line.split("\t");
        points.push([parseFloat(s[0]), parseFloat(s[1])]);
      });
    return new SpectrumDO(name, points);
  }

  clone(): SpectrumDO {
    return new SpectrumDO(this.name, this.data, this.id);
  }
}

export class ComponentDO {
  constructor(public name: string, public owned_spectra: Array<SpectrumDO>, public formula?: string, public id?: number) {}

  static fromJson(json: any): ComponentDO {
    let owned_spectra: Array<SpectrumDO> = [];
    json.owned_spectra.forEach((spec: any) => {
      owned_spectra.push(new SpectrumDO(spec.name, spec.data, spec.id));
    });
    return new ComponentDO(json.name, owned_spectra, json.formula, json.id);
  }

  toJson() {
    return {
      name: this.name,
      formula: this.formula,
      owned_spectra: this.owned_spectra.map((spec: SpectrumDO) => spec.toJson())
    };
  }

  clone() {
    return new ComponentDO(this.name, [...this.owned_spectra], this.formula, this.id);
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