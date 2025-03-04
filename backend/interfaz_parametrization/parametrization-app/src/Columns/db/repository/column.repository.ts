import { IColumnRepositorie } from "../repositories/column.repositories";

//Mongo
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Columns } from "../model/columns.model";
import { CreateColumnsDto } from "src/Columns/dto/create-columns.dto";
import { UpdateColumnsDto } from "src/Columns/dto/update-columns.dto";
import { PaginatorDto } from "src/common/dto/input/paginator.dto";
import { ResponseDto } from "src/common/dto/output/response.dto";

export class ColumnsRepository implements IColumnRepositorie<Columns> {

    constructor(@InjectModel(Columns.name) private readonly columnsModel: Model<Columns>) { }
    

   public async create(createDto: CreateColumnsDto): Promise<Columns> {
        return await this.columnsModel.create(createDto);
    }

    public async findOneById(id: string): Promise<Columns | null> {
        return this.columnsModel.findOne({ _id: id }).exec(); 
    }

    public async findAll(paginatorDto:PaginatorDto): Promise<ResponseDto> {
        const {limit, page} = paginatorDto;
        if ( limit && page){
            const skip = (page - 1) * limit;
    
            const count = await this.columnsModel.countDocuments({where: {status: true}}).exec();
            const page_total = Math.floor((count - 1)/ limit) + 1;
            const data =  await this.columnsModel.find({where: {status: true}}).limit(limit).skip(skip).exec();
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

    public async update(id: string, updateDto: UpdateColumnsDto): Promise<Columns | null> {
        return this.columnsModel.findOneAndUpdate({ _id: id }, updateDto, { 
            new: true, 
          });
    }

    public async delete(id: string): Promise<boolean> {
        const result = await this.columnsModel.deleteOne({ _id: id }).exec();
        return result.deletedCount > 0;
    }



}