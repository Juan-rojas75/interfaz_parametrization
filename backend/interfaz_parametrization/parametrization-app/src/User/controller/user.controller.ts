import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';
import { ApiTags , ApiBody} from '@nestjs/swagger'; 
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('users')
@ApiTags('users') 
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  
  @Get()
  findAll(@Query() paginatorDto:PaginatorDto) {
    return this.userService.findAll(paginatorDto);
  }

  @Auth()
  @Get('by-token/')
  findByToken(@Request() req) {
    return this.userService.findOne(req.user.user);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  
  @Patch(':id')
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
