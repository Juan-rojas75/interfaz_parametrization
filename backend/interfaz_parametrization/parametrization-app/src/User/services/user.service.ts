import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../db/repository/user.repository';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';
import {  UserDocument } from '../db/model/user.model';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepository,
  ) {
  }
  //CRUD
  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    // Generar un hash de la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Generar un token permanente
    const apiToken = crypto.randomBytes(64).toString('hex');

    // Guardar el usuario con la contraseña encriptada
    return this.userRepository.create({
      ...userData,
      password: hashedPassword,
      access_token: apiToken,
    });
  }

  findAll(paginatorDto:PaginatorDto) {
    return this.userRepository.findAll(paginatorDto);
  }
  
  findOne(id: string) {
    return this.userRepository.findOneById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }

  //METHODS ESPECIFICS
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userRepository.findByEmail(email);
  }
}
