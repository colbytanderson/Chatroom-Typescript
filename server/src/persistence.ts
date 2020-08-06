import fs from 'fs';
import { Model, ModelArray } from "./model";

interface PersistedModelArrayOptions {
  saveIntervalSeconds?: number;
  dataDir?: string;
}

abstract class PersistedModelArray<T extends Model> extends ModelArray<T> {

  protected dirtyIds: number[] = [];
  protected dataDir: string;

  constructor(options: PersistedModelArrayOptions) {
    super();
    this.dataDir = options.dataDir || 'data';
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir);
    }
    setInterval(
      () => this.actuallySave(),
      (options.saveIntervalSeconds || 5) * 1000
    );
  }

  save(id: number) {
    this.dirtyIds.push(id);
  }

  protected abstract write(ids: number[], callback: (err: Error | null) => void): void;

  private actuallySave() {
    if (this.dirtyIds.length === 0) return;
    this.write(this.dirtyIds, () => {
      this.dirtyIds = [];
    });
  }

}

interface ModelArrayInFileOptions extends PersistedModelArrayOptions {
  filename: string;
}

export class ModelArrayInFile<T extends Model> extends PersistedModelArray<T> {

  private filename: string;

  constructor(options: ModelArrayInFileOptions) {
    super(options);

    this.filename = `${this.dataDir}/${options.filename}.json`;
    if (fs.existsSync(this.filename)) {
      const data = JSON.parse(fs.readFileSync(this.filename, 'utf8'));
      this.array = data.array;
      this.highestId = data.highestId;
    }
  }

  protected write(ids: number[], fn: (err: Error | null) => void) {
    const data = JSON.stringify({
      array: this.array,
      highestId: this.highestId,
    });
    fs.writeFile(this.filename, data, fn);
  }

}

interface ModelArrayInDirectoryOptions extends PersistedModelArrayOptions {
  dirname: string;
}

export class ModelArrayInDirectory<T extends Model> extends PersistedModelArray<T> {

  private dirname: string;
  private highestFilename: string;
  private lastWrittenHighest: number;

  constructor(options: ModelArrayInDirectoryOptions) {
    super(options);

    this.dirname = `${this.dataDir}/${options.dirname}`;
    this.highestFilename = `${this.dirname}/highest`;

    if (!fs.existsSync(this.dirname)) {
      fs.mkdirSync(this.dirname);
    }

    if (fs.existsSync(this.highestFilename)) {
      const nString = fs.readFileSync(this.highestFilename, 'utf8');
      this.highestId = parseInt(nString);
    }

    this.lastWrittenHighest = this.highestId;

    const partialFilenames = fs.readdirSync(this.dirname);
    partialFilenames.forEach(partialFilename => {
      const filename = `${this.dirname}/${partialFilename}`;
      const data = fs.readFileSync(filename, 'utf8');
      this.array.push(JSON.parse(data));
    });
  }

  write(ids: number[], fn: (err: Error | null) => void) {
    if (this.highestId !== this.lastWrittenHighest) {
      fs.writeFileSync(this.highestFilename, this.highestId.toString());
      this.lastWrittenHighest = this.highestId;
    }

    Promise.all(ids.map(id => {
      const filename = `${this.dirname}/${id.toString().padStart(7, '0')}.json`;
      return new Promise(resolve => {
        const o = this.array.find(item => item.id === id);
        if (!o) return;
        fs.writeFile(filename, JSON.stringify(o), err => resolve(err));
      });
    })).then(() => fn(null)).catch(fn);
  }

}
