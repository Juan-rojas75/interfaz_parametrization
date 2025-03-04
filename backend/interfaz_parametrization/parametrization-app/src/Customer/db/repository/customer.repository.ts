import { CustomerRepositorie } from "../repositories/customer.repositories";

//Mongo
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerDto } from "src/Customer/dto/create-customer.dto";
import { UpdateCustomerDto } from "src/Customer/dto/update-customer.dto";
import { Customer } from "../model/customer.model";
import { PaginatorDto } from "src/common/dto/input/paginator.dto";
import { ResponseDto } from "src/common/dto/output/response.dto";


export class CustomerRepository implements CustomerRepositorie<Customer> {

    constructor(@InjectModel(Customer.name) private readonly customerModel: Model<Customer>) { }
    

   public async create(createDto: CreateCustomerDto): Promise<Customer> {
        return await this.customerModel.create(createDto);
    }

    public async findOneById(id: string): Promise<Customer | null> {
        return this.customerModel.findOne({ _id: id }).exec(); 
    }

    public async findAll(paginatorDto:PaginatorDto): Promise<ResponseDto> {
        const {limit, page} = paginatorDto;
        if ( limit && page){
            const skip = (page - 1) * limit;
    
            const count = await this.customerModel.countDocuments().exec();
            const page_total = Math.floor((count - 1)/ limit) + 1;
            const data =  await this.customerModel.find().limit(limit).skip(skip).exec();
            return {
                data: data,
                meta: {
                    paginator:{
                        total: count,
                        page: Number(page),
                        pages: page_total,
                        items_per_page: data.length,
                    },
                    status: 200,
                    message: 'Success'
                }
            }
        }
        else{
            throw new Error('Limit and page are required');
        }
    }

    public async update(id: string, updateDto: UpdateCustomerDto): Promise<Customer | null> {
        return this.customerModel.findOneAndUpdate({ _id: id }, updateDto, { 
            new: true, 
          });
    }

    public async delete(id: string): Promise<boolean> {
        const result = await this.customerModel.deleteOne({ _id: id }).exec();
        return result.deletedCount > 0;
    }



}