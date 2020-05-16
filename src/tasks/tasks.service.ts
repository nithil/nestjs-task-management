import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  // getAll(): Task[] {
  //   return this.tasks;
  // }
  // getWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAll();
  //   if (status) {
  //     tasks = tasks.filter(task => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter(
  //       task =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }
  //   return tasks;
  // }

  async getById(id: number): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne(id);

      if (!task) throw new NotFoundException('Task not found');

      return task;
    } catch (error) {
      throw error;
    }
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteById(id: number): Promise<void> {
    try {
      const { affected } = await this.taskRepository.delete(id);
      if (affected === 0) {
        throw new NotFoundException('Task not found');
      }
    } catch (error) {
      throw error;
    }
  }

  // updateStatus(id: string, status: TaskStatus): Task {
  //   let task = this.getById(id);
  //   task.status = status;
  //   return task;
  // }
}
