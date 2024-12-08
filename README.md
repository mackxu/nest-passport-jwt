<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# 使用 passport 做身份认证

## 注意事项

AuthGuard('local') 接受的参数名 默认是 username 和 password
可通过在LocalStrategy的构造函数中传入参数来修改

req 参数将包含 user 属性（在通行证本地身份验证流程中由 Passport 填充）

### 策略的流程
从 request 取一些信息，交给 validate 方法去验证，返回 user 放到 request.user 里

### Strategy取至不同的包中
```js
import { Strategy } from 'passport-jwt';
import { Strategy } from 'passport-local';
```

## 身份验证的策略模式
### LocalStrategy

```ts
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'userName' });
  }
  // 必须实现
  async validate(userName: string, password: string): Promise<any> {
    console.log('validate', userName, password);
    const user = await this.authService.validateUser(userName, password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return user;
  }
}
```

### JWTStrategy

```ts
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
```

## 装饰器

- applyDecorators 可以将多个装饰器应用于单个对象
- createParamDecorator 可以创建自定义参数装饰器，返回的函数接收参数或管道
- SetMetadata 可以将元数据附加到对象上

### createParamDecorator 源码
```ts
export type CustomParamFactory<TData = any, TInput = any, TOutput = any> = (
  data: TData,
  input: TInput,
) => TOutput;

export function createParamDecorator<
  FactoryData = any,
  FactoryInput = any,
  FactoryOutput = any
>(
  factory: CustomParamFactory<FactoryData, FactoryInput, FactoryOutput>,
  enhancers: ParamDecoratorEnhancer[] = [],
): (
  ...dataOrPipes: (Type<PipeTransform> | PipeTransform | FactoryData)[]
) => ParameterDecorator {
  const paramtype = uuid();
  return (
    data?,
    ...pipes: (Type<PipeTransform> | PipeTransform | FactoryData)[]
  ): ParameterDecorator => (target, key, index) => {
    const args =
      Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key) || {};

    const isPipe = (pipe: any) =>
      pipe &&
      ((isFunction(pipe) &&
        pipe.prototype &&
        isFunction(pipe.prototype.transform)) ||
        isFunction(pipe.transform));

    const hasParamData = isNil(data) || !isPipe(data);
    const paramData = hasParamData ? (data as any) : undefined;
    const paramPipes = hasParamData ? pipes : [data, ...pipes];

    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      assignCustomParameterMetadata(
        args,
        paramtype,
        index,
        factory,
        paramData,
        ...(paramPipes as PipeTransform[]),
      ),
      target.constructor,
      key,
    );
    enhancers.forEach(fn => fn(target, key, index));
  };
}
```
