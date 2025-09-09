import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule {}
