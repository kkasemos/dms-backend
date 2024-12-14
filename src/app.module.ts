import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UsersService } from './users/users.service';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true, // Set to `false` in production
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
  }), DocumentsModule,],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
