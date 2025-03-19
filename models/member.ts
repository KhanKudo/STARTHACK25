interface User {
    userId: number;
    userName: string;
    type: 'employee' | 'admin' | 'customer';
}

interface EmployeeExtends extends User {}

interface AdminExtends extends User {}

interface CustomerExtends extends User {}

export { User, EmployeeExtends, AdminExtends, CustomerExtends };