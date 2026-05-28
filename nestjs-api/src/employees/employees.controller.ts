import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/user.decorator';

@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @Post()
    async create(
        @Body() dto: CreateEmployeeDto,
    ) {
        const employee = await this.employeesService.create(dto);
        return this.employeesService.findOne(employee.id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const employee = await this.employeesService.findOne(Number(id));
        if (!employee) throw new NotFoundException();
        return employee;
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateEmployeeDto,
        @CurrentUser() user: any,
    ) {
        const employee = await this.employeesService.findOne(Number(id));
        if (!employee) throw new NotFoundException();

        if (employee.contactInfo?.email !== user.email) {
            throw new ForbiddenException('Você só pode alterar seu próprio employee');
        }

        const affected = await this.employeesService.update(Number(id), dto);
        if (!affected) throw new NotFoundException();
        return this.employeesService.findOne(Number(id));
    }

    @Patch(':id/assign-manager')
    async assignManager(
        @Param('id') id: string,
        @Body() body: { managerId: number },
    ) {
        const affected = await this.employeesService.assignManager(
            Number(id),
            body.managerId,
        );
        if (!affected) throw new NotFoundException();
        return this.employeesService.findOne(Number(id));
    }
}