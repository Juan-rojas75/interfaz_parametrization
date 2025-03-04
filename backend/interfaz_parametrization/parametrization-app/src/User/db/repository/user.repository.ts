import { IUserRepositorie } from "../repositories/user.repositories";

//Mongo
import { User, UserDocument } from "../model/user.model";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from "src/User/dto/create-user.dto";
import { UpdateUserDto } from "src/User/dto/update-user.dto";
import { PaginatorDto } from "src/common/dto/input/paginator.dto";
import { ResponseDto } from "src/common/dto/output/response.dto";

export class UserRepository implements IUserRepositorie<User> {

   constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }
    
   public async create(createDto: CreateUserDto): Promise<User> {
        return await this.userModel.create(createDto);
    }

    public async findOneById(id: string): Promise<User | null> {
        return this.userModel.findOne({ _id: id }).populate('customer').populate('rol').exec(); 
    }

    public async findAll(paginatorDto:PaginatorDto): Promise<ResponseDto> {
        const {limit, page} = paginatorDto;
        if ( limit && page){
            const skip = (page - 1) * limit;
    
            const count = await this.userModel.countDocuments().exec();
            const page_total = Math.floor((count - 1)/ limit) + 1;
            const data =  await this.userModel.find().populate('customer').populate('rol').limit(limit).skip(skip).exec();
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

    public async update(id: string, updateDto: UpdateUserDto): Promise<User | null> {
        return this.userModel.findOneAndUpdate({ _id: id }, updateDto, { 
            new: true, 
          });
    }

    public async delete(id: string): Promise<boolean> {
        const result = await this.userModel.deleteOne({ _id: id }).exec();
        return result.deletedCount > 0;
    }


    public async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).populate('rol').exec(); 
    }


}