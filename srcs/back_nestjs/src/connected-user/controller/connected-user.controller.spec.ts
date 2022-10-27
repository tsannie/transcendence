import { Test, TestingModule } from '@nestjs/testing';
import { ConnectedUserController } from './connected-user.controller';

describe('ConnectedUserController', () => {
  let controller: ConnectedUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectedUserController],
    }).compile();

    controller = module.get<ConnectedUserController>(ConnectedUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
