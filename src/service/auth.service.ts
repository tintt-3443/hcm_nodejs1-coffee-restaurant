import { UserRepository } from '../repository/user.repository';
import { UserLoginDto, UserRegisterDto } from '../dto/auth/user_register.dto';
import { checkPassword, hashPassword } from '../utils/auth/auth';

export class AuthService {
  userRepository = new UserRepository();
  public async RegisterUser(userDTO: UserRegisterDto) {
    try {
      const hashedPassword: string = await hashPassword(userDTO.password);
      const user = this.userRepository.create({
        ...userDTO,
        password: hashedPassword,
      });
      if (!user) {
        return null;
      }
      return await this.userRepository.save(user);
    } catch (error) {
      return null;
    }
  }

  public async LoginUser(userDTO: UserLoginDto) {
    try {
      const userExist = await this.userRepository.findOne({
        where: { email: userDTO.email },
      });
      if (!userExist) {
        return null;
      }

      const isCorrectPw = await checkPassword(
        userDTO.password,
        userExist.password,
      );
      if (!isCorrectPw) {
        return null;
      }
      return userExist;
    } catch (error) {
      return null;
    }
  }
}
