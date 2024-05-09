import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ICreateRating } from '../interface/interface';
import { RatingService } from '../service/rating.service';

const ratingService = new RatingService();
export const createRating = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const rating = req.body?.rating_point;
      const comment = req.body?.comment;
      const user = req.session.user;
      const productId = req.body?.productId;
      const ratingExist = await ratingService.getRatingByUser(
        user?.id,
        productId,
      );
      if (ratingExist) {
        ratingExist.rating_point = rating;
        ratingExist.comment = comment;
        await ratingService.updateRating(ratingExist);
        res.json({ status: true });
      }
      const params: ICreateRating = {
        rating_point: rating,
        comment,
        userId: user?.id,
        productId,
      };
      await ratingService.createRating(params);
      res.json({ status: true });
    } catch (error) {
      console.log('err', error);
      res.json({ status: false });
    }
  },
);

export const getRating = asyncHandler(async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    const rating = await ratingService.getRating(productId);
    res.json(rating);
  } catch (error) {
    console.log('err', error);
    res.json({ status: false });
  }
});
