import { Inject, Injectable } from '@nestjs/common';
import { CreateSessionDto } from '../dto/create-session.dto';
import { UpdateSessionDto } from '../dto/update-session.dto';
import { SessionRepository } from '../db/repository/session.repository';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';

@Injectable()
export class SessionsService {

  constructor(
    @Inject('SessionRepositoryInterface')
    private readonly sessionRepository: SessionRepository,
  ) { }
  create(createSessionDto: CreateSessionDto) {
    return this.sessionRepository.create(createSessionDto);
  }

  findAll(paginatorDto:PaginatorDto) {
    return this.sessionRepository.findAll(paginatorDto)
  }

  findByUserId(userId: string) {
    return this.sessionRepository.findByUserId(userId);
  }

  findOne(id: string) {
    return this.sessionRepository.findOneById(id);
  }

  findByAccessToken(acces_token: string) {
    return this.sessionRepository.findByAccessToken(acces_token);
  }

  findByIp(ip: string) {
    return this.sessionRepository.findByIp(ip);
  }

  findByAccessTokenActive(acces_token: string) {
    return this.sessionRepository.findByAccessTokenActive(acces_token);
  }

  update(id: string, updateSessionDto: UpdateSessionDto) {
    return this.sessionRepository.update(id, updateSessionDto);
  }

  remove(id: string) {
    return this.sessionRepository.delete(id);
  }

  revoke(id: string) {
    return this.sessionRepository.revoke(id);
  }
  revokeAll(userId: string) {
    return this.sessionRepository.revokeAll(userId);
  }

}
