import { Blog } from '../entities/Blog';
import { BaseRepository } from './base.repository';

export class BlogRepository extends BaseRepository<Blog> {
  constructor() {
    super(Blog);
  }
}
