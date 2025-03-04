import { CustomerModule } from "./Customer/customer.module";
import { Logger, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { MongooseModule } from "@nestjs/mongoose";

import { UserModule } from "./User/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ColumnsModule } from "./Columns/columns.module";
import { RolesModule } from './roles/roles.module';
import { TemplateModule } from "./Template/template.module";
import { DataTemplateModule } from './data-template/data-template.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { SessionMiddleware } from "./auth/middleware/session.middleware";

@Module({
  imports: [
    CustomerModule,
    // ConfigModule para cargar configuraciones desde .env
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    //Mongoose
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get("DATABASE_USER")}:${configService.get("DATABASE_PASSWORD")}@${configService.get("DATABASE_HOST")}:${configService.get("DATABASE_PORT")}`,
      }),
      inject: [ConfigService],
    }),
    // Modules
    UserModule,
    TemplateModule,
    ColumnsModule,
    CustomerModule,
    RolesModule,
    DataTemplateModule,
    AuthModule,
    SessionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  private readonly logger = new Logger(AppModule.name);

  constructor(private readonly configService: ConfigService) {}
  
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
    this.logger.log(`SE HA CARGADO EL MIDDLEWARE`);
    this.logger.log(`mongodb://${this.configService.get("DATABASE_USER")}:${this.configService.get("DATABASE_PASSWORD")}@${this.configService.get("DATABASE_HOST")}:${this.configService.get("DATABASE_PORT")}`);
  }
  
}