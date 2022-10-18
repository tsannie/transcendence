import { PipeTransform, Injectable, ArgumentMetadata, FileValidator } from "@nestjs/common";

export declare type AvatarFormatValidatorOptions = {
    format: string[];
}

const jpeg: Array<string> = [
    'ffd8ffe0',
    'ffd8ffee',
    'ffd8ffe1XXXX457869660000',
];

const png: string = "89504e470d0a1a0a";


export class AvatarFormatValidator extends FileValidator<AvatarFormatValidatorOptions>{

    private _isjpeg(buffer: Buffer): boolean{
        let magic_number = buffer.toString('hex', 0, 12);
        if (magic_number.slice(0, 8) === jpeg[0]
            || magic_number.slice(0,8) === jpeg[1]
            || magic_number.slice(0, 8) + 'XXXX' + magic_number.slice(12, 24) === jpeg[2])
            return true;
        else
            return false;
    }

    private _ispng(buffer: Buffer): boolean{
        let magic_number = buffer.toString('hex', 0, 8);

        if (magic_number === png)
            return true;
        else
            return false;
    }

    private _checkFormat(buffer: Buffer): boolean {
        let jpeg_bool : boolean;
        let png_bool : boolean;

        if (this.validationOptions.format.includes("jpeg") || this.validationOptions.format.includes("jpg"))
            jpeg_bool = this._isjpeg(buffer);
        if (this.validationOptions.format.includes("png"))
            png_bool = this._ispng(buffer);
        if (!jpeg_bool && !png_bool)
            return false;
        return true;
    }

    private _checkExtension(filename: string) : boolean {
        if (filename.slice(-5) === '.jpeg' || filename.slice(-4) === '.png' || filename.slice(-4) === '.jpg')
            return true;
        else
            return false;
    }

    public isValid(file: Express.Multer.File): boolean{
        if (!this.validationOptions)
            return true;

        if (!this._checkExtension(file.originalname))
            return false;

        if (!this._checkFormat(file.buffer))
            return false;
        return true;
    }

    public buildErrorMessage(): string
    {
        return 'Wrong file format';
    }
}
