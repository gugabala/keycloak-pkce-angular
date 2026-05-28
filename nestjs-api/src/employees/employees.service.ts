import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { ContactInfo } from './entities/contact-info.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private employeeRepo: Repository<Employee>,
        @InjectRepository(ContactInfo)
        private contactInfoRepo: Repository<ContactInfo>,
    ) { }

    async create(dto: CreateEmployeeDto): Promise<Employee> {
        const contactInfo = this.contactInfoRepo.create(dto.contactInfo ?? {});
        await this.contactInfoRepo.save(contactInfo);

        const employee = this.employeeRepo.create({
            name: dto.name,
            managerId: dto.managerId,
            contactInfo,
        });

        return this.employeeRepo.save(employee);
    }

    async findOne(id: number): Promise<Employee | null> {
        return this.employeeRepo.findOne({
            where: { id },
            relations: { contactInfo: true, manager: true },
        });
    }

    async update(id: number, dto: UpdateEmployeeDto): Promise<number> {
        const employee = await this.employeeRepo.findOne({
            where: { id },
            relations: { contactInfo: true },
        });

        if (!employee) return 0;

        if (dto.name) employee.name = dto.name;

        if (dto.contactInfo && employee.contactInfo) {
            Object.assign(employee.contactInfo, dto.contactInfo);
            await this.contactInfoRepo.save(employee.contactInfo);
        }

        await this.employeeRepo.save(employee);
        return 1;
    }

    async assignManager(id: number, managerId: number): Promise<number> {
        const result = await this.employeeRepo.update(id, { managerId });
        return result.affected ?? 0;
    }

    async findByEmail(email: string): Promise<Employee | null> {
        return this.employeeRepo.findOne({
            where: { contactInfo: { email } },
            relations: { contactInfo: true, manager: true },
        });
    }
}