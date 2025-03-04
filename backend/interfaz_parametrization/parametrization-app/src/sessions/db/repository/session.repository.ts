//Mongo

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';
import { ResponseDto } from 'src/common/dto/output/response.dto';
import { ISessionsRepositorie } from '../repositories/session.repositories';
import { Session, SessionDocument } from '../model/session.model';
import { CreateSessionDto } from 'src/sessions/dto/create-session.dto';
import { UpdateSessionDto } from 'src/sessions/dto/update-session.dto';

export class SessionRepository implements ISessionsRepositorie<Session> {

    constructor(@InjectModel(Session.name) private readonly sessionModel: Model<Session>) { }
    
   public async create(createDto: CreateSessionDto): Promise<Session> {
        return await this.sessionModel.create(createDto);
    }

    public async findOneById(id: string): Promise<Session | null> {
        return this.sessionModel.findOne({ _id: id }).exec(); 
    }

    public async findByAccessToken(acces_token: string): Promise<SessionDocument | null> {
        return this.sessionModel.findOne({ accessToken: acces_token }).populate('user').exec(); 
    }
    
    public async findByAccessTokenActive(acces_token: string): Promise<SessionDocument | null> {
        return this.sessionModel.findOne({ accessToken: acces_token, revokedAt: null }).exec(); 
    }

    public async findAll(paginatorDto:PaginatorDto): Promise<ResponseDto> {
        const {limit, page} = paginatorDto;
        if ( limit && page){
            const skip = (page - 1) * limit;
    
            const count = await this.sessionModel.countDocuments({where: {revokedAt: null}}).exec();
            const page_total = Math.floor((count - 1)/ limit) + 1;
            const data =  await this.sessionModel.find({where: {revokedAt: null}}).limit(limit).skip(skip).exec();
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

    public async findByUserId(userid: string): Promise<Session[] | null> {
        return this.sessionModel.find({ user: userid }).exec();
    }

    public async findByIp(ip: string): Promise<Session | null> {
        return this.sessionModel.findOne({ ip: ip }).lean().exec();
    }

    public async update(id: string, updateDto: UpdateSessionDto): Promise<Session | null> {
        return this.sessionModel.findOneAndUpdate({ _id: id }, updateDto, { 
            new: true, 
          });
    }

    public async delete(id: string): Promise<boolean> {
        const result = await this.sessionModel.deleteOne({ _id: id }).exec();
        return result.deletedCount > 0;
    }

    public async revoke(id: string): Promise<boolean> {
        try {
            await this.sessionModel.findOneAndUpdate({ _id: id }, { revokedAt: new Date() }).exec();
        } catch (error) {
            return false
        }
        return true;
    }
    
    public async revokeAll(userId: string): Promise<boolean> {
        try {
            await this.sessionModel.updateMany({ user: userId },{ revokedAt: new Date() },).exec();
        } catch (error) {
            return false
        }
        return true
    }
}