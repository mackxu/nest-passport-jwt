import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Strategy } from 'passport-local';
import { JWT_CONSTANTS } from './constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 使用标准方法在 API 请求的授权标头中提供不记名令牌
      ignoreExpiration: false, // 提供了过期的 JWT，请求将被拒绝并发送 401 Unauthorized 响应
      secretOrKey: JWT_CONSTANTS.secret, // 对称秘密
    });
  }
  // Passport 首先验证 JWT 的签名并解码 JSON。然后它调用我们的 validate()
  async validate(payload: any) {
    return { uid: payload.uid, userName: payload.userName };
  }
}
