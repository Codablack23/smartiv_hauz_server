import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './config';
import { AuthModule } from './auth/auth.module';
import { PromotionsModule } from './promotions/promotions.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          ...AppDataSource.options,
          autoLoadEntities: true,
        };
      },
    }),
    AuthModule,
    PromotionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
