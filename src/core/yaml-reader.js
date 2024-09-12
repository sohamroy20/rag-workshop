import * as yaml from 'js-yaml';
import { existsSync, readFileSync } from 'fs';
class YamlReader {
    constructor(filePath) {
        Object.defineProperty(this, "filePath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.filePath = filePath;
    }
    async readYaml() {
        if (!existsSync(this.filePath)) {
            throw new Error(`YAML file not found: ${this.filePath}`);
        }
        const fileContent = readFileSync(this.filePath, 'utf8');
        const data = yaml.load(fileContent);
        return data;
    }
}
