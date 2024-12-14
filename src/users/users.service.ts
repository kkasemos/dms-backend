import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; // Import bcrypt
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new user.
   * Hash the password before saving it to the database.
   */
  async create(createUserDto: CreateUserDto) {
    const { username, email, password, role, preferences } = createUserDto;

    // Hash the password with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      username,
      email,
      passwordHash,
      role,
      preferences: JSON.stringify(preferences || {}),
    });

    return this.userRepository.save(user);
  }

  /**
   * Find all users, optionally filtering by role or department.
   */
  async findAll(role?: string, department?: string) {
    const query = this.userRepository.createQueryBuilder('user');
    if (role) query.andWhere('user.role = :role', { role });
    if (department) query.andWhere('user.department = :department', { department });
    return query.getMany();
  }

  /**
   * Find a single user by ID.
   */
  async findOne(userID: number) {
    const user = await this.userRepository.findOne({ where: { userID } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userID} not found`);
    }
    return user;
  }

  /**
   * Update user data.
   */
  async update(userID: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(userID);
    Object.assign(user, {
      ...updateUserDto,
      preferences: updateUserDto.preferences
        ? JSON.stringify(updateUserDto.preferences)
        : user.preferences,
    });
    return this.userRepository.save(user);
  }

  /**
   * Remove a user by ID.
   */
  async remove(userID: number) {
    const result = await this.userRepository.delete(userID);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${userID} not found`);
    }
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
    });
  }
}
