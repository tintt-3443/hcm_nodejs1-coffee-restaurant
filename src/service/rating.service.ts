import { ICreateRating } from 'src/interface/interface';
import { RatingRepository } from '../repository/rating.repository';
import { ProductRepository } from '../repository/product.repository';
import { Rating } from '../entities/Rating';

export class RatingService {
  private ratingRepository: RatingRepository;
  private productRepository: ProductRepository;
  //create constructor
  constructor() {
    this.ratingRepository = new RatingRepository();
    this.productRepository = new ProductRepository();
  }

  public async createRating(params: ICreateRating) {
    try {
      const productExist = await this.productRepository.findOne({
        where: { id: params.productId },
      });
      if (!productExist) {
        return null;
      }
      const rating = this.ratingRepository.create({
        user: { id: params.userId },
        product: { id: params.productId },
        rating_point: params.rating_point,
        comment: params.comment,
      });
      const rs = await this.ratingRepository.save(rating);

      return rs;
    } catch (error) {
      return null;
    }
  }

  public async getRating(productId: number) {
    try {
      const productExist = this.productRepository.findOne({
        where: { id: productId },
      });
      if (!productExist) {
        return null;
      }
      const rating = await this.ratingRepository.find({
        where: { product: { id: productId } },
        relations: ['user'],
      });
      if (!rating) {
        return null;
      }
      return rating;
    } catch (error) {
      return null;
    }
  }

  public async getRatingByUser(userId: number, productId: number) {
    try {
      const productExist = this.productRepository.findOne({
        where: { id: productId },
      });
      if (!productExist) {
        return null;
      }
      const rating = await this.ratingRepository.findOne({
        where: { user: { id: userId }, product: { id: productId } },
        relations: ['user'],
      });
      if (!rating) {
        return null;
      }
      return rating;
    } catch (error) {
      return null;
    }
  }
  public async statisticRating(productId: number) {
    try {
      const productExist = await this.productRepository.findOne({
        where: { id: productId },
      });
      if (!productExist) {
        return null;
      }
      const ratings = await this.ratingRepository.find({
        where: { product: { id: productId } },
        relations: ['user'],
      });
      let totalRatingPoints = 0;
      const ratingCounts: Record<number, number> = {};
      if (!ratings) {
        return null;
      }
      // const ratingCounts = {};
      for (let i = 1; i <= 5; i++) {
        ratingCounts[i] = 0;
      }

      ratings.forEach((rating) => {
        const ratingPoint = rating.rating_point;
        ratingCounts[ratingPoint]++;
        totalRatingPoints += ratingPoint;
      });

      const numberOfRatings = ratings.length;

      const averageRating =
        numberOfRatings > 0
          ? (totalRatingPoints / numberOfRatings).toFixed(2)
          : 0;
      productExist.rating_avg = Number(totalRatingPoints / numberOfRatings);
      await this.productRepository.save(productExist);
      return {
        ratingCounts,
        averageRating,
        numberOfRatings,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async updateRating(rating: Rating) {
    try {
      const ratingExist = await this.ratingRepository.findOne({
        where: { id: rating.id },
      });
      if (!ratingExist) {
        return null;
      }
      const rs = await this.ratingRepository.save(rating);
      return rs;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
