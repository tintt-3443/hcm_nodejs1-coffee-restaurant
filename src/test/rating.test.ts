import { AppDataSource } from '../config/ormconfig';
import { DataSource } from 'typeorm';
import { RatingService } from '../service/rating.service';
import { Rating } from '../entities/Rating';
let ratingsService: RatingService;
let connection: DataSource;
beforeAll(async () => {
  connection = await AppDataSource.initialize();
  ratingsService = new RatingService();
});

afterAll(async () => {
  await connection.destroy();
});

describe('createRating', () => {
  it('should create rating when created successfully', async () => {
    const params = {
      userId: 1,
      productId: 1,
      rating_point: 5,
      comment: 'good',
    };
    const rating = await ratingsService.createRating(params);
    expect(rating).toBeDefined();
    expect(rating?.id).toBeDefined();
    expect(rating?.rating_point).toBe(params.rating_point);
    expect(rating?.comment).toBe(params.comment);
    expect(rating?.user?.id).toBe(params.userId);
  });

  it('should return null when userId and productId invalid', async () => {
    const params = {
      userId: -1,
      productId: -1,
      rating_point: 5,
      comment: 'good',
    };
    const rating = await ratingsService.createRating(params);
    expect(rating).toBeNull();
  });
});

describe('getRating', () => {
  it('should return rating', async () => {
    const productId = 1;
    const rating = await ratingsService.getRating(productId);
    expect(rating).not.toBeNull();
  });

  it('should return null when product not exist', async () => {
    const productId = -1;
    const rating = await ratingsService.getRating(productId);
    expect(rating).toBeNull();
  });
  it('should return null when product exist but rating not exist', async () => {
    const productId = 10;
    const rating = await ratingsService.getRating(productId);
    expect(rating).toEqual([]);
  });
});

describe('getRatingByUser', () => {
  it('should return rating', async () => {
    const userId = 1;
    const productId = 1;
    const rating = await ratingsService.getRatingByUser(userId, productId);
    expect(rating).not.toBeNull();
  });

  it('should return null when product not exist', async () => {
    const userId = 1;
    const productId = -1;
    const rating = await ratingsService.getRatingByUser(userId, productId);
    expect(rating).toBeNull();
  });

  it('should return null when user not exist', async () => {
    const userId = -1;
    const productId = 1;
    const rating = await ratingsService.getRatingByUser(userId, productId);
    expect(rating).toBeNull();
  });
  it('should return null when user and product not exist', async () => {
    const userId = -1;
    const productId = -1;
    const rating = await ratingsService.getRatingByUser(userId, productId);
    expect(rating).toBeNull();
  });
});

describe('statisticRating', () => {
  it('should return statistic rating', async () => {
    const productId = 1;
    const rating = await ratingsService.statisticRating(productId);
    expect(rating).not.toBeNull();
    expect(Number(rating?.averageRating)).toBeGreaterThanOrEqual(0);
    expect(Number(rating?.averageRating)).toBeLessThan(5);
  });

  it('should return null when product not exist', async () => {
    const productId = -1;
    const rating = await ratingsService.statisticRating(productId);
    expect(rating).toBeNull();
  });
});

describe('updateRating', () => {
  it('should return updated rating', async () => {
    const params = {
      userId: 1,
      productId: 1,
    };
    const rating = await ratingsService.getRatingByUser(
      params.userId,
      params.productId,
    );
    expect(rating).toBeDefined();
    expect(rating?.id).toBeDefined();
    const paramsUpdate = {
      userId: 1,
      productId: 1,
      rating_point: 4,
      comment: 'update',
    };
    if (rating) {
      rating.comment = paramsUpdate.comment;
      rating.rating_point = paramsUpdate.rating_point;
    }
    const ratingUpdate = await ratingsService.updateRating(rating as Rating);
    expect(ratingUpdate).not.toBeNull();
  });
});
