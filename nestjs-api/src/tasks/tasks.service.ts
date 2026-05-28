import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private taskRepo: Repository<Task>,
    ) { }

    async findAll(): Promise<Task[]> {
        return this.taskRepo.find({
            relations: { assignee: true },
        });
    }

    async findOne(id: number): Promise<Task | null> {
        return this.taskRepo.findOne({
            where: { id },
            relations: { assignee: true },
        });
    }
}