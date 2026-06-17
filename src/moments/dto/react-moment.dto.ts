import { IsEnum } from 'class-validator';

export enum ReactionType {
  GOING = 'GOING',
  INTERESTED = 'INTERESTED',
  LIKE = 'LIKE',
}

export class ReactMomentDto {
  @IsEnum(ReactionType)
  type!: ReactionType;
}