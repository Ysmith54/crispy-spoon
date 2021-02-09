import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from '../dynamo/dynamo';
import {Employee} from './employee';
//import logger from '../../log';


class EmployeeService {
    private doc: DocumentClient;

    constructor() {
        this.doc = dynamo;
    }

    async getEmployeeByName(username: string): Promise<Employee | null> {
        // GetItem api call allows us to get something by the key
        const params = {
            TableName: 'employees',
            Key: {
                'username': username
            }
        };
        return await this.doc.get(params).promise().then((data) => {
            if (data && data.Item) {
                console.debug(`data.Item: ${JSON.stringify(data.Item)}`);
                return data.Item as Employee;
            } else {
                console.info(`Couldn't find user ${username}`);
                return null;
            }
        });
    }

    async addEmployee(employee: Employee): Promise<boolean> {
        // object to be sent to AWS.
        const params = {
            TableName: 'employees',
            Item: employee,
            ConditionExpression: '#username <> :username',
            ExpressionAttributeNames: {
                '#username': 'username',
            },
            ExpressionAttributeValues: {
                ':username': employee.username,
            }
        };

        return await this.doc.put(params).promise().then((result) => {
            console.info(`Successfully added ${employee.username} to the DynamoDB`);
            return true;
        }).catch((error) => {
            console.error(`Could not add employee to table: ${error}`);
            return false;
        });
    }

    async removeFunds(username: string, money: number): Promise<boolean> {
        const params = {
            TableName: 'employees',
            Key: {
                'username': username
            },
            UpdateExpression: 'set #funds = #funds - :money',
            ExpressionAttributeNames: {
                '#funds': 'remainingFunds'
            },
            ExpressionAttributeValues: {
                ':money': money
            },
            ReturnValues: 'UPDATED_NEW'
        }

        return await this.doc.update(params).promise().then((result) => {
            console.info(`Taken ${money} out of ${username}'s account`);
            return true;
        }).catch((err) => {
            console.error(err);
            return false;
        });
    }

    // Once a year, reset all employees' available funds to $1000
    // I can't believe DynamoDB won't let you update multiple items at once?
    async resetAllFunds() {
        const getParams = {
            TableName: 'employees'
        }

        return await this.doc.scan(getParams).promise().then((data) => {
            const employees = data.Items as Employee[];

            employees.forEach((employee) => {
                const params = {
                    TableName: 'employees',
                    Key: {
                        'username': employee.username
                    },
                    UpdateExpression: 'set #funds = :untouched',
                    ExpressionAttributeNames: {
                        '#funds': 'remainingFunds'
                    },
                    ExpressionAttributeValues: {
                        ':untouched': 1000
                    }
                };
                this.doc.update(params).promise().then((result) => {
                    console.debug(`updated user ${employee.username}`);
                }).catch((err) => {
                    console.error(err);
                });
            });
        });
    }
}

const employeeService = new EmployeeService();
export default employeeService;


// class EmployeeService {

//     private doc: DocumentClient;

//     //interface with Dynamo
//     constructor(){
//         this.doc = dynamo;
//     }

   
//     //getUser
//     async getEmployeeByUsername(username: string): Promise<User | null> {
//         // GetItem api call allows us to get something by the key
//         const params = {
//             TableName: 'employees',
//             Key: {
//                 'username': username
//             }
//         };
        
//         return await this.doc.get(params).promise().then((data) => {
//                 if (data && data.Item) {
//                     return data.Item as User;
//                 } else {
//                     return null;
//                 }
//             });
//     }

//     async getEmployeeByDepartmentRole(department: string, role: string = 'Department Head'): Promise<User[]> {
//         const params = {
//             TableName: 'employees',
//             FilterExpression: '#d = :d and #r = :r',
//             ProjectionExpression: '#user, #d, #r',
//             ExpressionAttributeNames: {
//                 '#user': 'username',
//                 '#d': 'department',
//                 '#r': 'role'
//             },
//             ExpressionAttributeValues: {
//                 ':d': department,
//                 ':r': role
//             }
//         };

//         return await this.doc.scan(params).promise().then((result) => {
//                 return result.Items as User[];
//             }).catch((err) => {
//                 //logger.error(err);
//                 return [];
//             });
//     }

//     async addEmployee(employee: User): Promise<boolean> {
//         // object to be sent to AWS.
//         const params = {
//             // TableName - the name of the table we are sending it to
//             TableName: 'employees',
//             // Item - the object we are sending
//             Item: employee,
//             ConditionExpression: '#username <> :username',
//             ExpressionAttributeNames: {
//                 '#username': 'username'
//             },
//             ExpressionAttributeValues: {
//                 ':username': employee.username
//             }
//         };

//         /*
//             The await is just returning all of that as another promise
//                 to be resolved by a different layer of the application.
//             put function takes in our params, and PUTs (http method) the item in the db.
//             promise function returns a promise representation of the request
//         */
//         return await this.doc.put(params).promise().then((result) => {
//                 //logger.info('Successfully created item');
//                 console.log(result)
//                 return true;
//             }).catch((error) => {
//                 //logger.error(error);
//                 console.log(error);
//                 return false;
//             });
//     }

//     async updateEmployee(employee: User) {
//         const params = {
//             TableName: 'employees',
//             Key: {
//                 'username': employee.username
//             },
//             UpdateExpression: 'set availableReimburstment = :m',
//             ExpressionAttributeValues: {
//                 ':m': employee.availableReimburstment
//             },
//             ReturnValues: 'UPDATED_NEW'
//         };
//         return await this.doc.update(params).promise().then((data) => {
//                 //logger.debug(data);
//                 console.log(data)
//                 return true;
//             }).catch((error) => {
//                 //logger.error(error);
//                 console.log(error);
//                 return false;
//             });
//     }

// }

// const employeeService = new EmployeeService();
// export default employeeService;
