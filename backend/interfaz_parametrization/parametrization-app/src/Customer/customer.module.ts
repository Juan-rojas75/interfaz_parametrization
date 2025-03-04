import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './db/model/customer.model';
import { CustomerController } from './controller/customer.controller';
import { CustomerService } from './services/customer.service';
import { CustomerRepository } from './db/repository/customer.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }])],
  controllers: [CustomerController],
  providers: [
      CustomerService,
      {
          provide: 'CustomerRepositoryInterface',
          useClass: CustomerRepository
        }
      ],
  exports: []
})
export class CustomerModule {}
