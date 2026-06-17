import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { MomentsService } from './moments.service';
import { CreateMomentDto } from './dto/create-moment.dto';
import { ReactMomentDto } from './dto/react-moment.dto';
import { Request } from 'express';

@Controller('moments')
export class MomentsController {
  constructor(private readonly momentsService: MomentsService) {}

  @Post()
  create(@Req() req: Express.Request, @Body() dto: CreateMomentDto) {
    return this.momentsService.create(req.user.uid, dto);
  }

  @Get('nearby')
  findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius: string,
    @Query('category') category: string,
  ) {
    return this.momentsService.findNearby(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : 2000,
      category,
    );
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.momentsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.momentsService.findOne(id);
  }

  @Post(':id/react')
  react(@Param('id') id: string, @Body() dto: ReactMomentDto) {
    return this.momentsService.react(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req:Express.Request) {
    return this.momentsService.remove(id, req.user.uid);
  }
}