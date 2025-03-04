import { Inject, Injectable } from '@nestjs/common';
import { CustomerRepository } from '../db/repository/customer.repository';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';


@Injectable()
export class CustomerService {
  constructor(
      @Inject('CustomerRepositoryInterface')
      private readonly customerRepository: CustomerRepository,
    ) {
    }
  create(createDto: CreateCustomerDto) {
    createDto.createdAt = new Date();
    createDto.updatedAt = new Date();
    return this.customerRepository.create(createDto);
  }

  findAll(paginatorDto:PaginatorDto) {
    return this.customerRepository.findAll(paginatorDto);
  }

  findOne(id: string) {
    return this.customerRepository.findOneById(id);
  }

  update(id: string, updateDto: UpdateCustomerDto) {
    return this.customerRepository.update(id, updateDto);
  }

  remove(id: string) {
    return this.customerRepository.delete(id);
  }
}
