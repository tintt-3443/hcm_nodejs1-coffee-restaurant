import { AppDataSource } from '../config/ormconfig';
import { DataSource } from 'typeorm';
import { UserService } from '../service/user.service';
import { SEX_USER } from '../constant/enum';

let userService: UserService;
let connection: DataSource;
beforeAll(async () => {
  connection = await AppDataSource.initialize();
  userService = new UserService();
});

afterAll(async () => {
  await connection.destroy();
});

describe('getProfileUser', () => {
  it('should return user when id exist', async () => {
    const params = {
      userId: 1,
    };
    const result = await userService.getProfileUser(params.userId);
    expect(result).toBeDefined();
  });

  it('should return null when id not exist', async () => {
    const params = {
      userId: -1,
    };
    const result = await userService.getProfileUser(params.userId);
    expect(result).toBeNull();
  });
});

describe('updateProfileUser', () => {
  it('should return user when id exist and updated successfully', async () => {
    const params = {
      userId: 17,
      name: 'test',
      email: 'test11@gmail.com',
      phone: '123',
      address: '123',
      sex: SEX_USER.MALE,
      date_of_birth: '2021-01-01',
      avatar: 'link.png',
    };
    const result = await userService.updateProfileUser(params);
    expect(result).toBeDefined();
  });

  it('should return null when id not exist', async () => {
    const params = {
      userId: -1,
      name: 'test',
      email: 'test11@gmail.com',
      phone: '123',
      address: '123',
      sex: SEX_USER.MALE,
      date_of_birth: '2021-01-01',
      avatar: 'link.png',
    };
    const result = await userService.updateProfileUser(params);
    expect(result).toBeNull();
  });
});

describe('changePassword', () => {
  it('should return user when id exist and updated successfully', async () => {
    const params = {
      userId: 59,
      oldPassword: 'Testlogin@!!1234',
      newPassword: 'Testlogin@!!12345',
      confirmPassword: 'Testlogin@!!12345',
    };
    const result = await userService.changePassword(params);
    expect(result).toBeDefined();
  });

  it('should return null when id not exist', async () => {
    const params = {
      userId: -1,
      oldPassword: 'Test123@!!123',
      newPassword: 'Test123@!!1234',
      confirmPassword: 'Test123@!!1234',
    };
    const result = await userService.changePassword(params);
    expect(result).toBeNull();
  });
});

describe('getAllUsers', () => {
  it('should return user when id exist and updated successfully', async () => {
    const params = {
      page: 1,
      limit: 10,
    };
    const result = await userService.getAllUsers(params);
    expect(result).toBeDefined();
  });

  it('should return null when page and limit invalid', async () => {
    const params = {
      page: -1,
      limit: -1,
    };
    const result = await userService.getAllUsers(params);
    expect(result).toBeNull();
  });
});
