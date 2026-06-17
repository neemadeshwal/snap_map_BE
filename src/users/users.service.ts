import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository:UsersRepository) {}

  async create(uid: string, dto: CreateUserDto) {
    const existing = await this.userRepository.findById(uid);
    if (existing) throw new ConflictException('User already exists');
    return this.userRepository.create(uid,dto)
  }
  async findMe(uid:string){
    const user=await this.userRepository.findById(uid)
    if(!user) throw new NotFoundException('User not found');
    return user;
  }
  async findById(id:string){
    const user=await this.userRepository.findById(id);
    if(!user) throw new NotFoundException('User not found.')
    return user;
  }
  async update(uid:string,dto:UpdateUserDto){
    await this.findMe(uid);
    return this.userRepository.update(uid,dto)
    
  }
  async updateFcmToken(uid:string,fcmToken:string){
    return this.userRepository.updateFcmToken(uid,fcmToken)
  }
    async updateLocation(uid: string, latitude: number, longitude: number) {
    return this.userRepository.updateLocation(uid,latitude,longitude);
  }
  async remove(uid:string){
    await this.findMe(uid);
    return this.userRepository.delete(uid)
  }
   async searchByUsername(query: string) {
    return this.userRepository.searchByUsername(query);
  }
}
