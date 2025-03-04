import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, Logger } from '@nestjs/common';
import { SessionsService } from '../services/sessions.service';
import { CreateSessionDto } from '../dto/create-session.dto';
import { UpdateSessionDto } from '../dto/update-session.dto';
import { PaginatorDto } from 'src/common/dto/input/paginator.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
  ) {}
  private readonly logger = new Logger("SessionsController");

  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  findAll(@Query() paginatorDto:PaginatorDto) {
    return this.sessionsService.findAll(paginatorDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('session_user')
  getSessionUser(@Request() req) {
    return this.sessionsService.findByUserId(req.user.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(id);
  }

}
