import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// key: headers
// key: headers.x-forwarded-for
export const ReqAny = createParamDecorator((key, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return typeof key === 'string' ? getValue(request, key) : request;
});

function getValue(obj: Record<string, any>, key: string) {
  const keys = key.split('.').map((k) => k.toLocaleLowerCase());
  return keys.reduce((o, k) => o?.[k], obj);
}
