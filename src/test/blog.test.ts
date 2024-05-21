import { AppDataSource } from '../config/ormconfig';
import { DataSource } from 'typeorm';
import { RatingService } from '../service/rating.service';
import { BlogService } from '../service/blog.service';
let blogService: BlogService;
let connection: DataSource;
beforeAll(async () => {
  connection = await AppDataSource.initialize();
  blogService = new BlogService();
});

afterAll(async () => {
  await connection.destroy();
});

describe('createBlog', () => {
  it('should create	new blog when created successfully', async () => {
    const params = {
      title: 'title',
      description: 'description',
      content: 'content',
      image: 'image',
    };

    const blog = await blogService.createBlog(params);
    expect(blog).toBeDefined();
    expect(blog?.id).toBeDefined();
    expect(blog?.title).toBe(params.title);
    expect(blog?.description).toBe(params.description);
    expect(blog?.content).toBe(params.content);
    expect(blog?.image).toBe(params.image);
  });
});

describe('getBlogs', () => {
  it('should get all blogs when param valid', async () => {
    const params = {
      page: 1,
      limit: 10,
    };
    const blogs = await blogService.getBlogs(params);
    expect(blogs).toBeDefined();
    expect(blogs?.length).toBeGreaterThan(0);
  });

  it('should return null when page is invalid', async () => {
    const params = {
      page: -1,
      limit: 10,
    };
    const blogs = await blogService.getBlogs(params);
    expect(blogs).toBeNull();
  });
});

describe('getBlogById', () => {
  it('should return blog when id exist', async () => {
    const id = 1;
    const blog = await blogService.getBlogById(id);
    expect(blog).not.toBeNull();
  });

  it('should return null when id not exist', async () => {
    const id = -1;
    const blog = await blogService.getBlogById(id);
    expect(blog).toBeNull();
  });
});

describe('updateView', () => {
  it('should update view when id exist', async () => {
    const id = 1;
    const blog = await blogService.updateView(id);
    expect(blog).toBeTruthy();
  });

  it('should return false when id not exist', async () => {
    const id = -1;
    const blog = await blogService.updateView(id);
    expect(blog).toBeFalsy();
  });
});
