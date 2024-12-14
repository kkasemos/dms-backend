import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.create with the correct data', async () => {
      const createUserDto: CreateUserDto = { username: 'johndoe', password: 'abcd1234', email: 'johndoe@email.com', role: 'admin' }; // Replace with actual DTO properties
      mockUsersService.create.mockResolvedValue({ id: 1, ...createUserDto });

      const result = await usersController.create(createUserDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({ id: 1, ...createUserDto });
    });
  });

  describe('findAll', () => {
    it('should call usersService.findAll with the correct query parameters', async () => {
      const role = 'admin';
      const department = 'IT';
      mockUsersService.findAll.mockResolvedValue([{ id: 1, role, department }]);

      const result = await usersController.findAll(role, department);

      expect(mockUsersService.findAll).toHaveBeenCalledWith(role, department);
      expect(result).toEqual([{ id: 1, role, department }]);
    });
  });

  describe('findOne', () => {
    it('should call usersService.findOne with the correct ID', async () => {
      const userID = 1;
      mockUsersService.findOne.mockResolvedValue({ id: userID, name: 'John Doe' });

      const result = await usersController.findOne(userID);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(userID);
      expect(result).toEqual({ id: userID, name: 'John Doe' });
    });
  });

  describe('update', () => {
    it('should call usersService.update with the correct data', async () => {
      const userID = 1;
      const updateUserDto: UpdateUserDto = { role: 'user' }; // Replace with actual DTO properties
      mockUsersService.update.mockResolvedValue({ id: userID, ...updateUserDto });

      const result = await usersController.update(userID, updateUserDto);

      expect(mockUsersService.update).toHaveBeenCalledWith(userID, updateUserDto);
      expect(result).toEqual({ id: userID, ...updateUserDto });
    });
  });

  describe('remove', () => {
    it('should call usersService.remove with the correct ID', async () => {
      const userID = 1;
      mockUsersService.remove.mockResolvedValue({ message: 'User deleted successfully' });

      const result = await usersController.remove(userID);

      expect(mockUsersService.remove).toHaveBeenCalledWith(userID);
      expect(result).toEqual({ message: 'User deleted successfully' });
    });
  });
});
