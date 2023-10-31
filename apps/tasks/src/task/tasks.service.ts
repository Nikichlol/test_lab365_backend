import { Model, mongo } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.schema';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { User } from 'apps/auth/src/modules/user/user.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = new this.taskModel({
      ...createTaskDto,
      owner: user,
    });
    return task.save();
  }

  async delete({ id }: DeleteTaskDto, user: User): Promise<Task> {
    const task = await this.findOneByUser(id, user);

    return task.deleteOne();
  }

  async findAllByUser(user: User): Promise<Task[]> {
    const tasks = await this.taskModel.find({ owner: user });

    return tasks;
  }

  private async findOneByUser(id: string, user: User): Promise<Task> {
    const task = await this.taskModel.findOne({
      _id: new mongo.ObjectId(id),
      owner: user,
    });

    if (!task) throw new BadRequestException('Invalid task id or user');

    return task;
  }
}
