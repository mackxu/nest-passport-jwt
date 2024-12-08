import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwt: JwtService,
  ) {}

  async validateUser(userName: string, password: string): Promise<any> {
    const user = await this.userService.findOneByUserName(userName);
    if (user && user.password === password) {
      return { ...user, password: undefined };
    }
    return null;
  }

  async login(user: any) {
    console.log('sign token');
    return {
      access_token: this.jwt.sign({
        userName: user.userName,
        uid: user.id,
      }),
    };
  }
}
