"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dynamo_1 = __importDefault(require("../dynamo/dynamo"));
//import logger from '../../log';
var EmployeeService = /** @class */ (function () {
    function EmployeeService() {
        this.doc = dynamo_1.default;
    }
    EmployeeService.prototype.getEmployeeByName = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: 'employees',
                            Key: {
                                'username': username
                            }
                        };
                        return [4 /*yield*/, this.doc.get(params).promise().then(function (data) {
                                if (data && data.Item) {
                                    console.debug("data.Item: " + JSON.stringify(data.Item));
                                    return data.Item;
                                }
                                else {
                                    console.info("Couldn't find user " + username);
                                    return null;
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EmployeeService.prototype.addEmployee = function (employee) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
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
                        return [4 /*yield*/, this.doc.put(params).promise().then(function (result) {
                                console.info("Successfully added " + employee.username + " to the DynamoDB");
                                return true;
                            }).catch(function (error) {
                                console.error("Could not add employee to table: " + error);
                                return false;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EmployeeService.prototype.removeFunds = function (username, money) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
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
                        };
                        return [4 /*yield*/, this.doc.update(params).promise().then(function (result) {
                                console.info("Taken " + money + " out of " + username + "'s account");
                                return true;
                            }).catch(function (err) {
                                console.error(err);
                                return false;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Once a year, reset all employees' available funds to $1000
    // I can't believe DynamoDB won't let you update multiple items at once?
    EmployeeService.prototype.resetAllFunds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var getParams;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getParams = {
                            TableName: 'employees'
                        };
                        return [4 /*yield*/, this.doc.scan(getParams).promise().then(function (data) {
                                var employees = data.Items;
                                employees.forEach(function (employee) {
                                    var params = {
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
                                    _this.doc.update(params).promise().then(function (result) {
                                        console.debug("updated user " + employee.username);
                                    }).catch(function (err) {
                                        console.error(err);
                                    });
                                });
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return EmployeeService;
}());
var employeeService = new EmployeeService();
exports.default = employeeService;
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
