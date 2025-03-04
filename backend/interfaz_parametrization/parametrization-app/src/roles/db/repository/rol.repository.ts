//Mongo

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rol } from "../model/roles.model";
import { IRolRepositorie } from '../repositories/rol.repositories';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { UpdateRoleDto } from 'src/roles/dto/update-role.dto';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';
import { ResponseDto } from 'src/common/dto/output/response.dto';

export class RolesRepository implements IRolRepositorie<Rol> {

    constructor(@InjectModel(Rol.name) private readonly rolModel: Model<Rol>) { }
    

   public async create(createDto: CreateRoleDto): Promise<Rol> {
        return await this.rolModel.create(createDto);
    }

    public async findOneById(id: string): Promise<Rol | null> {
        return this.rolModel.findOne({ _id: id }).exec(); 
    }

    public async findAll(paginatorDto:PaginatorDto): Promise<ResponseDto> {
        const {limit, page} = paginatorDto;
        if ( limit && page){
            const skip = (page - 1) * limit;
    
            const count = await this.rolModel.countDocuments().exec();
            const page_total = Math.floor((count - 1)/ limit) + 1;
            const data =  await this.rolModel.find().limit(limit).skip(skip).exec();
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

    public async update(id: string, updateDto: UpdateRoleDto): Promise<Rol | null> {
        return this.rolModel.findOneAndUpdate({ _id: id }, updateDto, { 
            new: true, 
          });
    }

    public async delete(id: string): Promise<boolean> {
        const result = await this.rolModel.deleteOne({ _id: id }).exec();
        return result.deletedCount > 0;
    }



}