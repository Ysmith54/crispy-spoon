import employeeService from './employee.service';
//import logger from '../../log';

export enum employeeRole {
    employee = 0,
    supervisor,
    departmentHead,
    benCo
}

export class Employee {

    public remainingFunds: number;

    constructor(public username: string,
        private password: string,
        public immediateBoss: string,
        public role: employeeRole) {
            this.remainingFunds = 1000;
        }

    public static async login(username: string, password: string): Promise<Employee | null> {
        console.trace(`Logging in as ${username}`);
        if(!username) {
            console.warn(`Logged in with blank username`);
            return null;
        }
        let e = await employeeService.getEmployeeByName(username);
        if(e) {
            if(e.password === password) {
                return e;
            } else {
                console.warn(`Logged into ${username} account with incorrect password`);
                return null;
            }
        } else {
            console.warn(`Logged into a nonexisting account ${username}`);
            return null;
        }
    }
}
