import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { DmIdDto, DmTargetDto } from '../dto/dm.dto';
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
  async getDmsList(@Req() req: Request): Promise<DmEntity[]> {
    return await this.dmService.getDmsList(req.user);
  }

  @Post('create')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async createDm(
    @Body() data: DmTargetDto,
    @Req() req: Request,
  ): Promise<DmEntity> {
    return await this.dmService.createDm(data, req.user);
  }

  @Get('target')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getDmByTarget(
    @Query() data: DmTargetDto,
    @Req() req: Request,
  ): Promise<DmEntity | null> {
    return await this.dmService.getDmByTarget(data, req.user);
  }

  // get a dm by id
  @Get('datas')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getDmById(@Query() data: DmIdDto): Promise<DmEntity> {
    return await this.dmService.getDmById(data.id);
  }
}
