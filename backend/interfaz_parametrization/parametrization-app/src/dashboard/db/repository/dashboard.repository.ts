//Mongo
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';
import { ResponseDto } from 'src/common/dto/output/response.dto';
import { Dashboard } from '../model/dashboard.model';
import { DashboardRepositorie } from '../repositories/dashboard.repositories';
import { UpdateDashboardDto } from 'src/dashboard/dto/edit-dashboard.dto';
import { CreateDashboardDto } from 'src/dashboard/dto/create-dashboard.dto';


export class DashboardRepository implements DashboardRepositorie<Dashboard> {

    constructor(@InjectModel(Dashboard.name) private readonly dahboardModel: Model<Dashboard>) { }
    

   public async create(createDto: CreateDashboardDto): Promise<Dashboard> {
        return await this.dahboardModel.create(createDto);
    }

    public async findOneById(id: string): Promise<Dashboard | null> {
        return this.dahboardModel.findOne({ _id: id }).exec(); 
    }

    public async findByTemplate(id_template: string): Promise<Dashboard[] | null> {
        return this.dahboardModel.find({ template : id_template }).exec(); 
    }

    public async findAll(paginatorDto:PaginatorDto): Promise<ResponseDto> {
        const {limit, page} = paginatorDto;
        if ( limit && page){
            const skip = (page - 1) * limit;
    
            const count = await this.dahboardModel.countDocuments().exec();
            const page_total = Math.floor((count - 1)/ limit) + 1;
            const data =  await this.dahboardModel.find().limit(limit).skip(skip).exec();
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

    public async update(id: string, updateDto: UpdateDashboardDto): Promise<Dashboard | null> {
        return this.dahboardModel.findOneAndUpdate({ _id: id }, updateDto, { 
            new: true, 
          });
    }

    public async delete(id: string): Promise<boolean> {
        const result = await this.dahboardModel.deleteOne({ _id: id }).exec();
        return result.deletedCount > 0;
    }

    public async deleteByTemplate(template: string): Promise<boolean> {
        const result = await this.dahboardModel.deleteMany({ template: template }).exec();
        return result.deletedCount > 0;
    }

}