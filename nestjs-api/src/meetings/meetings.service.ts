import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from './entities/meeting.entity';

@Injectable()
export class MeetingsService {
    constructor(
        @InjectRepository(Meeting)
        private meetingRepo: Repository<Meeting>,
    ) { }

    async findAll(): Promise<Meeting[]> {
        return this.meetingRepo.find({
            relations: { attendees: true },
        });
    }

    async findOne(id: number): Promise<Meeting | null> {
        return this.meetingRepo.find({
            where: { id },
            relations: { attendees: true },
        }).then((r) => r[0] ?? null);
    }
}