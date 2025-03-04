import { PaginatorDto } from "src/common/dto/input/paginator.dto";
import { ResponseDto } from "src/common/dto/output/response.dto";
import { CreateSessionDto } from "src/sessions/dto/create-session.dto";
import { SessionDocument } from "../model/session.model";

export interface ISessionsRepositorie<Session> {
    create(createDto: CreateSessionDto): Promise<Session>;
    findOneById(id: string): Promise<Session | null>;
    findByAccessToken(access_token: string): Promise<Session | null>;
    findByAccessTokenActive(access_token: string): Promise<Session | null>;
    findAll(paginatorDto:PaginatorDto): Promise<ResponseDto>;
    findByUserId(userId: string): Promise<Session[] | null>;
    findByIp(ip: string): Promise<Session | null>;
    update(id: string, updateDto: Partial<Session>): Promise<Session | null>;
    delete(id: string): Promise<boolean>;
    revoke(id: string): Promise<boolean>;
    revokeAll(userId: string): Promise<boolean>;
  }