import { Rating } from '../entities/Rating';
import { BaseRepository } from './base.repository';

export class RatingRepository extends BaseRepository<Rating> {
  constructor() {
    super(Rating);
  }
}
