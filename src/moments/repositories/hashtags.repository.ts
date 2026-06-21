import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class HashtagsRepository {
  constructor(private db: DatabaseService) {}

  async findByName(name: string) {
    return this.db.hashtag.findUnique({ where: { name } });
  }

  async findTrending(limit: number = 10) {
    return this.db.hashtag.findMany({
      include: {
        _count: { select: { moments: true } },
      },
      orderBy: {
        moments: { _count: 'desc' },
      },
      take: limit,
    });
  }
}