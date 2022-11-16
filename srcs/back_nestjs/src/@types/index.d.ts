import { UserEntity } from 'src/user/models/user.entity';

declare global {
  namespace Express {
    interface User extends UserEntity {}
  }
}
