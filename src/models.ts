import path from 'path';
import fs from 'fs';

export class SpectrumDO {
  public static EMPTY: SpectrumDO = new SpectrumDO('', []);

  constructor(public name:string, public data:number[][], public id?: number) {}

  static fromJson(json: any): SpectrumDO {
    return new SpectrumDO(json.name, json.data, json.id);
  }

  toJson() {
    return Object.assign({}, this);
  }

  static fromFile(pathname: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(pathname, (err, data) => {
        if (err) {
          reject(err);
        } else {
          let name = path.parse(pathname).name;
          let ext = path.parse(pathname).ext;
          let delimiter = '\t';
          if (ext === '.txt') {
            delimiter = '\t';
          } else if (ext === '.csv') {
            delimiter = ',';
          }
          let points = new Array<Array<number>>();
          data
            .toString()
            .trim()
            .split("\n")
            .map((line: any) => {
              let s = line.split(delimiter);
              let x = parseFloat(s[0]);
              let y = parseFloat(s[1]);
              if (isNaN(x) || isNaN(y)) {
                reject("is not a number");
              }
              points.push([x, y]);
            });
          resolve(new SpectrumDO(name, points));
        }
      })
    });
  }

  clone(): SpectrumDO {
    return new SpectrumDO(this.name, this.data, this.id);
  }
}

export class ComponentDO {
  constructor(
    public name: string, 
    public ownedSpectra: Array<SpectrumDO>,
    public formula?: string,
    public state?: string,
    public id?: number) {
      if (!this.state) {
        this.state = 'offline';
      }
    }

    toDTO() {
      return new ComponentDTO(this.name, this.ownedSpectra, this.formula, this.id);
    }

    static fromDTO(comp: ComponentDTO, model?: ModelDTO): ComponentDO {
      let res = new ComponentDO(comp.name, comp.ownedSpectra, comp.formula);
      res.id = comp.id;
      if (model) {
        res.state = model.state;
      }
      return res;
    }

    clone(): ComponentDO {
      return new ComponentDO(this.name, [...this.ownedSpectra], this.formula, this.state, this.id);
    }
}

export class ComponentDTO {
  constructor(public name: string, 
    public ownedSpectra: Array<SpectrumDO>, 
    public formula?: string, 
    public id?: number) {}

  static fromJson(json: any): ComponentDTO {
    let ownedSpectra: Array<SpectrumDO> = [];
    json.owned_spectra.forEach((spec: any) => {
      ownedSpectra.push(new SpectrumDO(spec.name, spec.data, spec.id));
    });
    return new ComponentDTO(json.name, ownedSpectra, json.formula, json.id);
  }

  toJson() {
    return {
      name: this.name,
      formula: this.formula,
      owned_spectra: this.ownedSpectra.map((spec: SpectrumDO) => spec.toJson())
    };
  }

  clone() {
    return new ComponentDTO(this.name, [...this.ownedSpectra], this.formula, this.id);
  }
}

export class ModelDTO {
  constructor(readonly id: number, public state: string) {}

  static fromJson(json: any): ModelDTO {
    return new ModelDTO(json.id, json.state);
  }
}

export class DetectResult {
  constructor(readonly id: number, readonly probability: number) {}

  static fromJson(json: any): DetectResult {
    return new DetectResult(json.id, json.probability);
  }

  toJson() {
    return Object.assign({}, this);
  }
}

export interface Pipeline {
  method: string,
  params: any,
}
