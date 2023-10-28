import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { Request } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { DeleteTaskDto } from './dto/delete-task.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
    @Req() { currentUser }: Request,
  ) {
    const task = await this.tasksService.create(createTaskDto, currentUser);

    return {
      id: task.id,
    };
  }

  @Get()
  async getAll(@Req() { currentUser }: Request) {
    const tasks = await this.tasksService.findAllByUser(currentUser);

    return tasks.map(({ id, title, description }) => ({
      id,
      title,
      description,
    }));
  }

  @Delete()
  async delete(
    @Body(ValidationPipe) deleteTaskDto: DeleteTaskDto,
    @Req() { currentUser }: Request,
  ) {
    const task = await this.tasksService.delete(deleteTaskDto, currentUser);

    return {
      id: task.id,
    };
  }
}
