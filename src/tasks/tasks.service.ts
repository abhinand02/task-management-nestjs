import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(Task)
    private tasksRepository: TasksRepository) { };

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const query = this.tasksRepository.createQueryBuilder('task');
        // if () {

        // }
        const tasks = query.getMany();
        return tasks;
    }

    async getTaskById(id: string): Promise<Task> {
        const found = await this.tasksRepository.findOne({
            where: {
                id
            }
        });
        if (!found) {
            throw new NotFoundException('Task not found');

        }
        return found;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = this.tasksRepository.create({ title, description, status: TaskStatus.OPEN });

        await this.tasksRepository.save(task);
        return task;
    }

    async deleteTask(taskId: string): Promise<void> {

        const result = await this.tasksRepository.delete(taskId);

        if (result.affected === 0) {
            throw new NotFoundException('Task not found');
        }
    }

    async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(taskId);

        task.status = status;
        await this.tasksRepository.save(task);

        return task;
    }
}
