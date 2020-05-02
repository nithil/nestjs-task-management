import { Controller, Get, Post, Body } from '@nestjs/common';

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

  @Post()
  create(@Body() createTaskDto: CreateDto): Task {
    return this.tasksService.create(createTaskDto);
  }
}
