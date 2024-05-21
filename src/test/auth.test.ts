import { AuthService } from '../service/auth.service';
import { AppDataSource } from '../config/ormconfig';
import { DataSource } from 'typeorm';
import { UserRegisterDto } from 'src/dto/auth/user_register.dto';

let authService: AuthService;
let connection: DataSource;
beforeAll(async () => {
  connection = await AppDataSource.initialize();
  authService = new AuthService();
});

afterAll(async () => {
  await connection.destroy();
});

// test authService

describe('Register', () => {
  it('should return user if register successfully', async () => {
    const userDTO: UserRegisterDto = {
      username: 'Tran Trong Tin',
      email: 'test111@gmail.com',
      password: 'Test1213@!!123',
    };

    const user = await authService.RegisterUser(userDTO);

    expect(user).not.toBeNull();
    expect(user?.username).toBe(userDTO.username);
    expect(user?.email).toBe(userDTO.email);
  });

  it('should return null when email exist ', async () => {
    const params = {
      username: 'Tran Trong Tin',
      email: 'trantrongtin01012002@gmail.com',
      password: 'Test123@!!123',
    };
    const user = await authService.RegisterUser(params);
    expect(user).toBeNull();
  });

  it('should return null if the user creation fails because role invalid', async () => {
    const params = {
      username: 'Tran Trong Tin',
      email: 'test22@gmail.com',
      password: 'Test123@!!123',
      role: 'user1',
    };

    const user = await authService.RegisterUser(params);

    expect(user).toBeNull();
  });
});

describe('Login', () => {
  it('should return user when logged successfully ', async () => {
    const params = {
      username: 'test',
      password: 'Testlogin@!!1234',
      email: 'Testloginnn@example.com',
    };
    await authService.RegisterUser(params);
    const user = await authService.LoginUser({
      email: params.email,
      password: params.password,
    });
    expect(user).not.toBeNull();
    expect(user?.username).toBe(params.username);
    expect(user?.email).toBe(params.email);
  });

  it('should return null if user is not existing', async () => {
    const user = await authService.LoginUser({
      email: 'Testlog111in@example.com',
      password: 'Testlogin@!!123',
    });
    expect(user).toBeNull();
  });

  it('should return null if password incorrect  ', async () => {
    const params = {
      username: 'test',
      password: 'Testlogin@!!123',
      email: 'Testlogin@example.com',
    };
    await authService.RegisterUser(params);
    const user = await authService.LoginUser({
      email: params.email,
      password: params.password + 'test',
    });
    expect(user).toBeNull();
  });
});
