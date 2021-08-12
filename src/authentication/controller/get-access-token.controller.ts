import { Controller, Post, Body } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { GetAccessTokenDTO } from '../request/dto/get-access-token.dto';
import { getAccessTokenSchema } from '../request/schema/get-access-token.schema';
import { AuthenticationService } from '../../authentication/service/authentication.service';
import { TokenRO } from '../response/token.ro';

@ApiTags('auth')
@Controller('auth')
export class GetAccessTokenController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiResponse({ status: 200 })
  @ApiOperation({ summary: 'Get access token' })
  @Post('token')
  async getAccessToken(
    @Body(new ValidationPipe(getAccessTokenSchema))
    params: GetAccessTokenDTO
  ) {
    const data = await this.authenticationService.getTokens(
      params.email,
      params.password
    );

    return plainToClass(TokenRO, data?.AuthenticationResult);
  }
}
