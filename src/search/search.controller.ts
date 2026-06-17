import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('users')
  searchUsers(@Query('q') q:string){
    return this.searchService.searchUsers(q??'')
  }

  @Get('moments')
  searchMoments(
    @Query('q') q:string,
    @Query('category') category:string,
    @Query('city') city:string
  ){

    return this.searchService.searchMoments(q,category,city)

  }
    @Get('hashtag')
  searchByHashtag(@Query('q') q: string) {
    return this.searchService.searchByHashtag(q ?? '');
  }

  @Get('cities')
  searchByCity(
    @Query('city') city: string,
    @Query('category') category: string,
  ) {
    return this.searchService.searchByCity(city ?? '', category);
  }
}
