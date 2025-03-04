import { Module } from '@nestjs/common';
import { RolesController } from './controller/roles.controller';
import { RolesService } from './services/roles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Rol, RolSchema } from './db/model/roles.model';
import { RolesRepository } from './db/repository/rol.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Rol.name, schema: RolSchema }])],
  controllers: [RolesController],
  providers: [
    RolesService,
      {
        provide: 'RolesRepositoryInterface',
        useClass: RolesRepository
      }
    ],
})
export class RolesModule {}
