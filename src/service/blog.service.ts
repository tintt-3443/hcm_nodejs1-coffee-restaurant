import { ICreateBlog, IGetAllParams } from '../interface/interface';
import { BlogRepository } from '../repository/blog.repository';
import { ProductRepository } from '../repository/product.repository';
export class BlogService {
  private BlogRepository: BlogRepository;
  private productRepository: ProductRepository;
  //create constructor
  constructor() {
    this.BlogRepository = new BlogRepository();
    this.productRepository = new ProductRepository();
  }

  public async createBlog(params: ICreateBlog) {
    try {
      const blog = this.BlogRepository.create({
        title: params.title,
        description: params.description,
        image: params.image,
        content: params.content,
      });
      const rs = await this.BlogRepository.save(blog);

      return rs;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async getBlogs(params: IGetAllParams) {
    try {
      const blogs = await this.BlogRepository.find({
        skip: (params?.page - 1) * params?.limit,
        take: params?.limit,
      });
      return blogs;
    } catch (error) {
      return null;
    }
  }
}
