import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import { SecretService } from '../secret/secret.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly secretService: SecretService,
  ) {}

  async create({ password }: CreateUserDto): Promise<User> {
    const user = new this.userModel({
      password: this.secretService.encrypt(password),
    });
    return user.save();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException();

    return user;
  }
}
