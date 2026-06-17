import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { SearchRepository } from './repositories/search.repository';

@Injectable()
export class SearchService {
  constructor(private searchRepository: SearchRepository) {}

  async searchUsers(query: string) {
    if (query.length < 2) return [];

    return this.searchRepository.searchUsers(query);
  }

  async searchByHashtag(hashtag: string) {
    const tag = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;
    return this.searchRepository.searchByHashtag(tag);
  }

  async searchByCity(city: string, category?: string) {
    return this.searchRepository.searchByCity(city, category);
  }

  async searchMoments(query: string, category?: string, city?: string) {
    return this.searchRepository.searchMoments(query, category, city);
  }
}
