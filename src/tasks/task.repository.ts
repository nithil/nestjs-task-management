import { Repository, EntityRepository } from 'typeorm';

import { Task } from './task.entity';
import { User } from '../auth/user.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

import { TaskStatus } from './task-status.enum';
import { Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    try {
      const { status, search } = filterDto;

      let query = this.createQueryBuilder('task');

      query.where('task.userId = :userId', { userId: user.id });

      if (status) {
        query.andWhere('task.status = :status', { status });
      }

      if (search) {
        query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
      }

      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get task for  user '${user.username}', DTO: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw error;
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    try {
      const { title, description } = createTaskDto;

      let task = new Task();
      task.title = title;
      task.description = description;
      task.status = TaskStatus.OPEN;
      task.user = user;
      await task.save();

      delete task.user;

      return task;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }
}
