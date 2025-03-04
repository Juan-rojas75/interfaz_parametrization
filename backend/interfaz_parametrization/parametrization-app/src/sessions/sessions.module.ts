import { Module } from '@nestjs/common';
import { SessionsController } from './controller/sessions.controller';
import { SessionsService } from './services/sessions.service';
import { SessionRepository } from './db/repository/session.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './db/model/session.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }])],
  controllers: [SessionsController],
  providers: [
    SessionsService,
    {
      provide: 'SessionRepositoryInterface',
      useClass: SessionRepository
    }
  ],
  exports: [SessionsService],
})
export class SessionsModule {}
