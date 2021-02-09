import * as AWS from 'aws-sdk';
import { Employee, employeeRole } from '../employees/employee';
import employeeService from '../employees/employee.service';
import { Claim, courseType, gradeType } from '../requests/request';
import claimService from '../requests/request.service';

// Set the region
AWS.config.update({ region: 'us-west-2' });

// Create a DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

//EMPLOYEES TABLE WILL HOLD REGULAR EMPLOYEE, SUPERVISOR, DEPARTMENT HEAD, & HR/BENCO

const removeEmployees = {
    TableName: 'employees'
}


const employeeSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'username', //employee's username is the ID
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'username',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'employees',
    StreamSpecification: {
        StreamEnabled: false
    }
};


//CLAIMS TABLE TO HOLD ALL REIMBURSEMENT REQUESTS
//---KEEPING TRACK OF 4 KEY IDs:---
//1) Claim request ID  (used to sort claim requests)
//2) Person making the claim
//3) information of the claimer
//4) person who needs to approve claim request

const removeClaims = {
    TableName: 'claims'
}

const claimSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'id',
            AttributeType: 'N'
        },
        {
            AttributeName: 'claimer',
            AttributeType: 'S'
        },
        {
            AttributeName: 'claimee',
            AttributeType: 'S'
        },
        {
            AttributeName: 'infoFrom',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'claimer',
            KeyType: 'HASH'
        },
        {
            AttributeName: 'id',
            KeyType: 'RANGE'
        }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: 'claimeeIdIndex',
            KeySchema: [
                {
                    AttributeName: 'claimee',
                    KeyType: 'HASH'
                },
                {
                    AttributeName: 'id',
                    KeyType: 'RANGE'
                }
            ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 2,
                WriteCapacityUnits: 2
            }
        },
        {
            IndexName: 'infoIdIndex',
            KeySchema: [
                {
                    AttributeName: 'infoFrom',
                    KeyType: 'HASH'
                },
                {
                    AttributeName: 'id',
                    KeyType: 'RANGE'
                }
            ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 2,
                WriteCapacityUnits: 2
            }
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2
    },
    TableName: 'claims',
    StreamSpecification: {
        StreamEnabled: false
    }
};

ddb.deleteTable(removeEmployees, function (err, data) {
    if (err) {
        console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.info('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
    }
    setTimeout(() => {
        ddb.createTable(employeeSchema, (err, data) => {
            if (err) {
                console.error('Error', err);
            } else {
                console.log('Table Created', data);
                setTimeout(() => {
                    populateEmployeeTable();
                }, 10000);
            }
        });
    }, 5000);
});

ddb.deleteTable(removeClaims, function (err, data) {
    if (err) {
        console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.info('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
    }
    setTimeout(() => {
        ddb.createTable(claimSchema, (err, data) => {
            if (err) {
                console.error('Error', err);
            } else {
                console.info('Table Created', data);
                setTimeout(() => {
                    populateClaimTable();
                }, 20000);
            }
        });
    }, 15000);
});

function populateClaimTable() {
    let request1 = new Claim(
        'testEmp1',
        'testSup',
        'System Backup & Recovery',
        courseType.seminar,
        gradeType.none,
        'N/A',
        '2021-02-20',
        '2:00',
        30,
        'Learning how to backup computer system',
        'Will help improve quality of work');
    setTimeout(() => {
        let request2 = new Claim(
            'testEmp1',
            'testSup',
            'Intro to Bootstrap',
            courseType.technicalTraining,
            gradeType.letter,
            'C',
            '2021-08-01',
            '18:00',
            250,
            'Learning how to use Bootstrap with React and React Native',
            'Will improve quality of work');

        claimService.addClaim(request1).then(() => { });
        claimService.addClaim(request2).then(() => { });
    }, 100);
}

function populateEmployeeTable() {

    let regEmployee1 = new Employee('testEmp1', '1234', 'testSup', employeeRole.employee);
    let regEmployee2 = new Employee('testEmp2', '1234', 'dptHead', employeeRole.employee);
    let supervisor = new Employee('testSup', '1234', 'dptHead', employeeRole.supervisor);
    let dptHead1 = new Employee('dptHead', '1234', 'testHR', employeeRole.departmentHead);
    let benCo1 = new Employee('testHR', '1234', 'HRChief', employeeRole.benCo);

    employeeService.addEmployee(regEmployee1).then(() => []);
    employeeService.addEmployee(regEmployee2).then(() => []);
    employeeService.addEmployee(supervisor).then(() => []);
    employeeService.addEmployee(dptHead1).then(() => []);
    employeeService.addEmployee(benCo1).then(() => []);
}

