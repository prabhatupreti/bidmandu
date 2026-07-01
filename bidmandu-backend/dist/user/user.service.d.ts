import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserService {
    private userRepo;
    constructor(userRepo: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findByEmailOrPhone(identifier: string): Promise<User | null>;
    findById(id: string): Promise<User>;
    setSellerStatus(userId: string, isSeller: boolean): Promise<User>;
}
