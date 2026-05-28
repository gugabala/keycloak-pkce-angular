export class UpdateEmployeeDto {
    name?: string;
    contactInfo?: {
        phone?: string;
        email?: string;
    };
}