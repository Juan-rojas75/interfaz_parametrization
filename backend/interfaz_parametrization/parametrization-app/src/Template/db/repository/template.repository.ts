//Mongo
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TemplateRepositorie } from '../repositories/template.repositories';
import { Template, TemplateDocument } from '../model/template.model';
import { CreateTemplateDto } from 'src/Template/dto/create-template.dto';
import { UpdateTemplateDto } from 'src/Template/dto/update-template.dto';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';
import { ResponseDto } from 'src/common/dto/output/response.dto';


export class TemplateRepository implements TemplateRepositorie<Template> {

    constructor(@InjectModel(Template.name) private readonly templateModel: Model<Template>) { }
    

   public async create(createDto: CreateTemplateDto): Promise<TemplateDocument> {
        return await this.templateModel.create(createDto);
    }

    public async findByCustomer_Id(id_customer: string): Promise<Template[] | null> {
        return this.templateModel.find({ customer: id_customer }).exec(); 
    }

    public async findOneById(id: string): Promise<Template | null> {
        return this.templateModel.findOne({ _id: id }).populate('customer').exec(); 
    }

    public async findAll(paginatorDto:PaginatorDto): Promise<ResponseDto> {
        const {limit, page} = paginatorDto;
        if ( limit && page){
            const skip = (page - 1) * limit;
    
            const count = await this.templateModel.countDocuments().exec();
            const page_total = Math.floor((count - 1)/ limit) + 1;
            const data =  await this.templateModel.find().populate('customer').limit(limit).skip(skip).exec();
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

    public async update(id: string, updateDto: UpdateTemplateDto): Promise<TemplateDocument | null> {
        return this.templateModel.findOneAndUpdate({ _id: id }, updateDto, { 
            new: false, 
          });
    }

    public async delete(id: string): Promise<boolean> {
        const result = await this.templateModel.deleteOne({ _id: id }).exec();
        return result.deletedCount > 0;
    }



}