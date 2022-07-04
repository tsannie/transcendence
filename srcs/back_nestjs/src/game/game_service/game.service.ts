import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {

    getHello(): string {
        return 'Hello GAN!';
    }
}
