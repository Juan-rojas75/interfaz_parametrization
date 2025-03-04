//Mongo
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';
import { ResponseDto } from 'src/common/dto/output/response.dto';
import { DataTemplateRepositorie } from '../repositories/data-template.repositories';
import { DataTemplate } from '../model/data-template.model';
import { CreateDataTemplateDto } from 'src/data-template/dto/create-data-template.dto';
import { UpdateDataTemplateDto } from 'src/data-template/dto/update-data-template.dto';


export class DataTemplateRepository implements DataTemplateRepositorie<DataTemplate> {

    constructor(@InjectModel(DataTemplate.name) private readonly datatemplateModel: Model<DataTemplate>) { }
    

   public async create(createDto: CreateDataTemplateDto): Promise<DataTemplate> {
        return await this.datatemplateModel.create(createDto);
    }

    public async findOneById(id: string): Promise<DataTemplate | null> {
        return this.datatemplateModel.findOne({ _id: id }).exec(); 
    }

    public async findByTemplate(id_template: string): Promise<DataTemplate[] | null> {
        return this.datatemplateModel.find({ template : id_template }).exec(); 
    }

    public async findAll(paginatorDto:PaginatorDto): Promise<ResponseDto> {
        const {limit, page} = paginatorDto;
        if ( limit && page){
            const skip = (page - 1) * limit;
    
            const count = await this.datatemplateModel.countDocuments().exec();
            const page_total = Math.floor((count - 1)/ limit) + 1;
            const data =  await this.datatemplateModel.find().limit(limit).skip(skip).exec();
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

    public async update(id: string, updateDto: UpdateDataTemplateDto): Promise<DataTemplate | null> {
        return this.datatemplateModel.findOneAndUpdate({ _id: id }, updateDto, { 
            new: true, 
          });
    }

    public async delete(id: string): Promise<boolean> {
        const result = await this.datatemplateModel.deleteOne({ _id: id }).exec();
        return result.deletedCount > 0;
    }

    public async deleteByTemplate(template: string): Promise<boolean> {
        const result = await this.datatemplateModel.deleteMany({ template: template }).exec();
        return result.deletedCount > 0;
    }

}