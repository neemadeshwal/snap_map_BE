import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UsersRepository } from 'src/users/repositories/users.repository';

@Injectable()
export class SearchRepository {
  constructor(
    private usersRepository: UsersRepository,
    private db: DatabaseService,
  ) {}

  async searchUsers(query: string) {
    return this.usersRepository.searchByUsername(query);
  }

  async searchByHashtag(hashtag: string) {
    return this.db.momentHashtag.findMany({
      where: {
        hashtag: { name: { equals: hashtag, mode: 'insensitive' } },
      },
      include: {
        moment: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profileUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async searchByCity(city: string, category?: string) {
    return this.db.moment.findMany({
      where: {
        archived: false,
        expiresAt: {
          gt: new Date(),
        },
        user: {
          city: {
            equals: city,
            mode: 'insensitive',
          },
        },
        ...(category && { category }),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async searchMoments(query: string, category?: string, city?: string) {
    return this.db.moment.findMany({
      where: {
        archived: false,
        expiresAt: {
          gt: new Date(),
        },
        ...(category && { category }),
        ...(city && { user: { city: { equals: city, mode: 'insensitive' } } }),
        ...(query && {
          caption: {
            contains: query,
            mode: 'insensitive',
          },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });
  }
}
