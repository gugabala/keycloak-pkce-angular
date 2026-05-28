export class CreateEmployeeDto {
    name!: string;
    managerId?: number;
    contactInfo?: {
        phone?: string;
        email?: string;
    };
}