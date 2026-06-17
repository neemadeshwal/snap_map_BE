import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(private db: DatabaseService) {}

  async create(uid: string, dto: CreateUserDto) {
    return this.db.user.create({
      data: {
        id: uid,
        username: dto.username,
        bio: dto.bio,
        profileUrl: dto.profileUrl,
        city: dto.city,
        interests: dto.interests ?? [],
      },
    });
  }
  async findByUsername(username: string) {
    return await this.db.user.findUnique({ where: { username } });
  }
  async findById(id: string) {
    return this.db.user.findUnique({ where: { id } });
  }
  async update(id: string, dto: UpdateUserDto) {
    return this.db.user.update({
      where: { id },
      data: dto,
    });
  }
  async updateFcmToken(id: string, fcmToken: string) {
    return this.db.user.update({
      where: { id },
      data: { fcmToken },
    });
  }
  async updateLocation(id: string, latitude: number, longitude: number) {
    return this.db.user.update({
      where: { id },
      data: { latitude, longitude },
    });
  }
  async delete(id: string) {
    return this.db.user.delete({ where: { id } });
  }
   async searchByUsername(query: string, limit: number = 20) {
    return this.db.user.findMany({
      where: {
        username: {
          startsWith: query,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        username: true,
        profileUrl: true,
        city: true,
      },
      take: limit,
    });
  }
}
