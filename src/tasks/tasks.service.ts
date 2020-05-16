import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto) {
    return this.taskRepository.getTasks(filterDto);
  }

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

  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    try {
      let task = await this.getById(id);
      task.status = status;
      await task.save();

      return task;
    } catch (error) {
      throw error;
    }
  }
}
