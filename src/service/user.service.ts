import { UserRepository } from '../repository/user.repository';
import { User } from '../entities/User';
import { UserChangePassword, UserUpdateDto } from '../dto/user/user.dto';
import { checkPassword, hashPassword } from '../utils/auth/auth';
import { IGetAllParams } from '../interface/interface';
export class UserService {
  private userRepository: UserRepository;
  //create constructor
  constructor() {
    this.userRepository = new UserRepository();
  }

  public async getProfileUser(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  public async updateProfileUser(params: UserUpdateDto) {
    try {
      const userExist = await this.userRepository.findOne({
        where: { id: params.userId },
      });
      if (!userExist) {
        return null;
      }
      const user: User = this.userRepository.create({
        password: userExist.password,
        id: params.userId,
        ...params,
      });

      const userUpdated = await this.userRepository.save(user);
      return userUpdated;
    } catch (error) {
      return null;
    }
  }

  public async changePassword(params: UserChangePassword) {
    try {
      const userExist = await this.userRepository.findOne({
        where: { id: params.userId },
      });

      if (!userExist) {
        return null;
      }
      const isMatch = await checkPassword(
        params.oldPassword,
        userExist.password,
      );
      if (!isMatch) {
        return null;
      }
      const newPass = await hashPassword(params.newPassword);
      userExist.password = newPass;
      const user = await this.userRepository.save(userExist);
      return user || null;
    } catch (error) {
      return null;
    }
  }

  public async getAllUsers(params: IGetAllParams) {
    try {
      const query = this.userRepository.createQueryBuilder('user').select();
      const users = await query
        .orderBy('user.id', 'DESC')
        .limit(params?.limit)
        .offset((params?.page - 1) * params?.limit)
        .getMany();
      if (!users) return null;
      return users;
    } catch (error) {
      return null;
    }
  }
}
