import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    Put,
    Delete,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';

  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
    }

    @Get()
    findAll(
      @Query('role') role?: string,
      @Query('department') department?: string,
    ) {
      return this.usersService.findAll(role, department);
    }

    @Get(':userID')
    findOne(@Param('userID') userID: number) {
      return this.usersService.findOne(Number(userID));
    }

    @Put(':userID')
    update(
      @Param('userID') userID: number,
      @Body() updateUserDto: UpdateUserDto,
    ) {
      return this.usersService.update(Number(userID), updateUserDto);
    }

    @Delete(':userID')
    remove(@Param('userID') userID: number) {
      return this.usersService.remove(Number(userID));
    }
  }
