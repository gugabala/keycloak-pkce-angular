import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { ContactInfo } from '../employees/entities/contact-info.entity';
import { Task } from '../tasks/entities/task.entity';
import { Meeting } from '../meetings/entities/meeting.entity';

@Injectable()
export class SeedService {
    constructor(private readonly dataSource: DataSource) { }

    async seed() {
        const count = await this.dataSource.getRepository(Employee).count();
        if (count > 0) {
            console.log('>> Seed já executado, pulando...');
            return;
        }

        await this.dataSource.transaction(async (db) => {
            const contactInfo = db.create(ContactInfo, {
                email: 'ceo@example.com',
                phone: '123-456-7890',
            });

            const ceo = db.create(Employee, {
                name: 'MR. CEO',
                contactInfo,
            });

            await db.save(ceo);

            const manager = db.create(Employee, {
                name: 'Manager',
                manager: ceo,
                contactInfo: db.create(ContactInfo, {}),
            });

            await db.save(manager);

            const task1 = db.create(Task, {
                name: 'Contratar Gente',
                assignee: manager,
            });

            const task2 = db.create(Task, {
                name: 'Presente CEO',
                assignee: manager,
            });

            await db.save([task1, task2]);

            const meeting = db.create(Meeting, {
                attendees: [ceo, manager],
                topic: 'Daily com o CEO',
                zoomUrl: 'https://zoom.us/j/1234567890',
            });
            await db.save(meeting);

            const meeting2 = db.create(Meeting, {
                attendees: [ceo],
                topic: 'Planning com o CEO',
                zoomUrl: 'https://zoom.us/j/1234567890',
            });
            await db.save(meeting2);

            meeting2.attendees = [ceo, manager];
            await db.save(meeting2);

            console.log('>> Seed executado com sucesso!');
        });
    }
}