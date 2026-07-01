import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepo.findOne({
      where: [{ email: createUserDto.email }, { phone: createUserDto.phone }],
    });
    if (existing) {
      throw new ConflictException('User with this email or phone already exists');
    }
    const user = this.userRepo.create(createUserDto);
    return this.userRepo.save(user);
  }

  async findByEmailOrPhone(identifier: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: [{ email: identifier }, { phone: identifier }],
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async setSellerStatus(userId: string, isSeller: boolean): Promise<User> {
    const user = await this.findById(userId);
    user.is_seller = isSeller;
    return this.userRepo.save(user);
  }
}