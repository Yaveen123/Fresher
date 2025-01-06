import { BinaryLike } from 'crypto';

declare class InputFile {
    static fromBuffer(parts: Blob | BinaryLike, name: string): File;
    static fromPath(path: string, name: string): File;
    static fromPlainText(content: string, name: string): File;
}

export { InputFile };
