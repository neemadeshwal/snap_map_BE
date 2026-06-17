import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateMomentDto } from '../dto/create-moment.dto';

@Injectable()
export class MomentsRepository {
  constructor(private db: DatabaseService) {}
  async create(userId: string, dto: CreateMomentDto) {
    return await this.db.moment.create({
      data: {
        userId,
        caption: dto.caption,
        mediaUrl: dto.mediaUrl,
        category: dto.category,
        expiresAt: new Date(dto.expiresAt),
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
    });
    //    // update PostGIS location column via raw SQL
    // await this.db.$executeRaw`
    //   UPDATE "Moment"
    //   SET location = ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)
    //   WHERE id = ${moment.id}
    // `;
    // return moment;
  }

    async updateLocation(id: string, lat: number, lng: number) {
    return this.db.$executeRaw`
      UPDATE "Moment"
      SET location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
      WHERE id = ${id}
    `;
  }

  async findNearby(lat: number, lng: number, radius: number) {
    return this.db.$queryRaw<any[]>`
        SELECT 
          m.*,
          ST_Distance(
            m.location::geography,
            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
          ) as distance,
          u.username,
          u."profileUrl"
        FROM "Moment" m
        JOIN "User" u ON u.id = m."userId"
        WHERE 
          m.archived = false
          AND m."expiresAt" > NOW()
          AND ST_DWithin(
            m.location::geography,
            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
            ${radius}
          )
        ORDER BY m."createdAt" DESC
      `;
  }
  async findNearbyByCategory(
    lat: number,
    lng: number,
    radius: number,
    category: string,
  ) {
    return this.db.$queryRaw<any[]>`
      SELECT 
        m.*,
        ST_Distance(
          m.location::geography,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
        ) as distance,
        u.username,
        u."profileUrl"
      FROM "Moment" m
      JOIN "User" u ON u.id = m."userId"
      WHERE 
        m.archived = false
        AND m."expiresAt" > NOW()
        AND m.category = ${category}
        AND ST_DWithin(
          m.location::geography,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
          ${radius}
        )
      ORDER BY m."createdAt" DESC
    `;
  }

  async findById(id: string) {
    return await this.db.moment.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, profileUrl: true } },
      },
    });
  }

  async findByUser(userId: string) {
    return this.db.moment.findMany({
      where: {
        userId,
        archived: false,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  async incrementReaction(id: string, field: string) {
    return this.db.moment.update({
      where: { id },
      data: { [field]: { increment: 1 } },
    });
  }

  async findAllActive() {
    return this.db.moment.findMany({
      where: {
        archived: false,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async archive(id: string) {
    return this.db.moment.update({
      where: { id },
      data: {
        archived: true,
        archivedAt: new Date(),
      },
    });
  }
  async findExpired(){
    return this.db.moment.findMany({
        where:{
            archived:false,
            expiresAt:{
                lt:new Date()
            },
            
        },
        take:100
    })
  }
}
