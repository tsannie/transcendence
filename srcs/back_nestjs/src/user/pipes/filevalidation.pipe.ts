import { PipeTransform, Injectable, ArgumentMetadata, FileValidator } from "@nestjs/common";

export declare type AvatarFormatValidatorOptions = {
    format: string;
}


export class AvatarFormatValidator extends FileValidator<AvatarFormatValidatorOptions>{
    public async isValid(file: Express.Multer.File): Promise<boolean> {
        if (!this.validationOptions)
            return true;

        
        console.log("VOILA LE FILE = ", file);
        // console.log(await fileTypeFromFile(file.originalname))
    }

    buildErrorMessage(): string
    {
        return '';
    }
}