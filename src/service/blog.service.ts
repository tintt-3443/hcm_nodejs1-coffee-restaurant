import { IGetAllParams } from '../interface/interface';
import { BlogDto } from '../dto/admin/admin.dto';
import { BlogRepository } from '../repository/blog.repository';
import { ProductRepository } from '../repository/product.repository';
export class BlogService {
  private blogRepository: BlogRepository;
  private productRepository: ProductRepository;
  //create constructor
  constructor() {
    this.blogRepository = new BlogRepository();
    this.productRepository = new ProductRepository();
  }

  public async createBlog(params: BlogDto) {
    try {
      const blog = this.blogRepository.create({
        title: params.title,
        description: params.description,
        image: params.image,
        content: params.content,
      });
      return await this.blogRepository.save(blog);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async getBlogs(params: IGetAllParams) {
    try {
      return await this.blogRepository
        .createQueryBuilder('blog')
        .select()
        .orderBy('blog.id', 'DESC')
        .limit(params.limit)
        .offset((params.page - 1) * params.limit)
        .getMany();
    } catch (error) {
      return null;
    }
  }

  public async getBlogById(id: number) {
    try {
      return await this.blogRepository.findOne({
        where: { id },
      });
    } catch (error) {
      return null;
    }
  }

  public updateView = async (id: number) => {
    try {
      const blog = await this.getBlogById(id);
      if (blog) {
        blog.view = blog.view + 1;
        await this.blogRepository.save(blog);
        return true;
      }
      return false;
    } catch (error) {
      console.log('error', error);
      return false;
    }
  };
}
