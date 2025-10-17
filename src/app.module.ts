import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './config';
import { AuthModule } from './auth/auth.module';
import { PromotionsModule } from './promotions/promotions.module';
import { SeederModule } from './seeder/seeder.module';
import { ArticleModule } from './article/article.module';
import { VideosModule } from './videos/videos.module';
import { OffersModule } from './offers/offers.module';
import { QuotesModule } from './quotes/quotes.module';
import { ProjectsModule } from './projects/projects.module';
import { ClientsModule } from './clients/clients.module';
import { StatsModule } from './stats/stats.module';
import { InvoicesModule } from './invoices/invoices.module';
import { CustomerModule } from './customer/customer.module';
import { ReviewModule } from './review/review.module';
import { TeamsMemberModule } from './team-members/team-member.module';
import { EmailMessagesModule } from './email-messages/email-messages.module';
import { ResourcesModule } from './resources/resources.module';

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
    SeederModule,
    ArticleModule,
    VideosModule,
    OffersModule,
    QuotesModule,
    ProjectsModule,
    ClientsModule,
    StatsModule,
    InvoicesModule,
    CustomerModule,
    ReviewModule,
    TeamsMemberModule,
    EmailMessagesModule,
    ResourcesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
