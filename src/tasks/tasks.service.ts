import { Injectable } from '@nestjs/common';
import { v1 as uuid } from 'uuid';

import { Task, TaskStatus } from './task.model';
import { CreateDto } from './dto/create.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAll(): Task[] {
    return this.tasks;
  }

  getById(id: string): Task {
    return this.tasks.find(task => task.id === id);
  }

  create(createTaskDto: CreateDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteById(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }
}
