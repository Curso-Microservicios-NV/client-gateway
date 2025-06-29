import { Controller, Post, Inject, Get, Body, UseGuards } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { User, Token } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';


@Controller('auth')
export class AuthController {

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUserDto)
      .pipe(
        catchError(error => {
          throw new RpcException(error);
        })
      );
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto)
      .pipe(
        catchError(error => {
          throw new RpcException(error);
        })
      );
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyUser(
    @User() user: CurrentUser,
    @Token() token: string
  ) {

    return { user, token };
  }

}
