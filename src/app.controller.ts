import { Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { IsPublic } from './is-public.decorator';
import { ReqAny } from './decorators/req-any.decorator';
import { ReqUser } from './req-user.decorator';

@Controller()
export class AppController {
  @Inject()
  private readonly authService: AuthService;

  @IsPublic()
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@ReqUser() user: any) {
    return this.authService.login(user);
  }

  @Post('profile')
  getProfile(@ReqAny('user') user: any) {
    return user;
  }

  @IsPublic()
  @Get('home')
  home(@ReqAny('headers.User-Agent') ua: string) {
    console.log('ua', ua);
    return 'home';
  }
}
