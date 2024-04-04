import { BaseRepository } from './base.repository';
import { User } from '../entities/User';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }
}
