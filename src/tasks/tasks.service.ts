import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../auth/user.entity';
import { Task } from './task.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

import { TaskRepository } from './task.repository';

import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User) {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getById(id: number, user: User): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ where: { id, userId: user.id } });

      if (!task) throw new NotFoundException('Task not found');

      return task;
    } catch (error) {
      throw error;
    }
  }

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteById(id: number, user: User): Promise<void> {
    try {
      const { affected } = await this.taskRepository.delete({ id, userId: user.id });
      if (affected === 0) {
        throw new NotFoundException('Task not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    try {
      let task = await this.getById(id, user);
      task.status = status;
      await task.save();

      return task;
    } catch (error) {
      throw error;
    }
  }
}
