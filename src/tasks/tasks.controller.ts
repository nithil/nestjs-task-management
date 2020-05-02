import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateDto } from './dto/create.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAll(): Task[] {
    return this.tasksService.getAll();
  }

  @Get('/:id')
  getById(@Param('id') id: string): Task {
    return this.tasksService.getById(id);
  }

  @Post()
  create(@Body() createTaskDto: CreateDto): Task {
    return this.tasksService.create(createTaskDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string): void {
    this.tasksService.deleteById(id);
  }
}
