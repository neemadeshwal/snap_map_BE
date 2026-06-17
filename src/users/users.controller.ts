import { Body, Controller, Get, Param, Patch, Post, Req,Delete, } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import express from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateFcmTokenDto } from './dto/update-fcm-token.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Req() req:express.Request,@Body() dto:CreateUserDto){
    return this.usersService.create(req.user.uid,dto);
  }
  @Get('me')
  findMe(@Req() req:express.Request){
    return this.usersService.findMe(req.user.uid);
  }
  @Patch('me')
  update(@Req() req:express.Request, @Body() dto:UpdateUserDto){
    return this.usersService.update(req.user.uid,dto)
  }
  @Patch('me/fcm-token')
  updateFcmToken(@Req() req:express.Request,@Body() dto:UpdateFcmTokenDto){
    return this.usersService.updateFcmToken(req.user.uid,dto.fcmToken)
  }
  @Patch('me/location')
  updateLocation(@Req() req:express.Request,@Body() dto:UpdateLocationDto){
    return this.usersService.updateLocation(
      req.user.uid,
      dto.latitude,
      dto.longitude
    )}

  @Get(':id')
  findById(@Param('id')id:string){
    return this.usersService.findById(id);
  }
  @Delete('me')
  remove(@Req() req: express.Request) {
    return this.usersService.remove(req.user.uid);
  }
  

}
