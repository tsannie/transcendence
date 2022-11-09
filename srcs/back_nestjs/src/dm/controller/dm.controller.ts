import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Request,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { DmIdDto, DmNameDto } from '../dto/dm.dto';
import { DmEntity } from '../models/dm.entity';
import { DmService } from '../service/dm.service';

@Controller('dm')
@UseInterceptors(ClassSerializerInterceptor)
export class DmController {
  constructor(private readonly dmService: DmService) {}

  // get all conversations of a user
  @Get('list')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getDmsList(@Request() req): Promise<DmEntity[]> {
    return await this.dmService.getDmsList(req.user);
  }

  @Post('create')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async createDm(
    @Body() data: DmNameDto,
    @Request() req,
  ): Promise<void | DmEntity> {
    return await this.dmService.createDm(data, req.user);
  }

  // get a dm by id
  @Get('datas')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getDmById(@Query() data: DmIdDto): Promise<DmEntity> {
    return await this.dmService.getDmById(data.id);
  }
}
