import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { UsersModule } from 'src/users/users.module';
import { SearchRepository } from './repositories/search.repository';
import { UsersRepository } from 'src/users/repositories/users.repository';

@Module({
  imports:[UsersModule],
  controllers: [SearchController],
  providers: [SearchService,SearchRepository,UsersRepository],
})
export class SearchModule {}
