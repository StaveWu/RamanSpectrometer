import electron from 'electron';
import path from 'path';
import fs from 'fs';

export class Preference {
  path: string;
  data: any;
  constructor(defaults: any) {
    const useDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(useDataPath, 'user-preferences.json');
    this.data = parseDataFile(this.path, defaults);
  }

  get(key: string) {
    return this.data[key];
  }

  set(key: string, val: any) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath: string, defaults: any) {
  try {
    return JSON.parse(fs.readFileSync(filePath).toString());
  }
  catch (error) {
    return defaults;
  }
}
