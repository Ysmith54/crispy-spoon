"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
//import logger from '../log';
var employee_1 = require("./employee");
var employee_service_1 = __importDefault(require("./employee.service"));
var router = express_1.default.Router();
router.get('/login', function (req, res, next) {
    var _a;
    //If logged in, go straight to home
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.employee) {
        console.trace("Tried to login, already logged in as " + req.session.employee);
        res.redirect('/');
    }
    //res.sendFile('login.html', { root: publicDir });
});
router.get('/', function (req, res, next) {
    var e = __assign({}, req.session.employee);
    delete e.password;
    res.send(JSON.stringify(e));
});
router.delete('/', function (req, res, next) {
    var _a;
    (_a = req.session) === null || _a === void 0 ? void 0 : _a.destroy(function (err) {
        if (err) {
            console.error(err);
        }
    });
    res.sendStatus(204);
});
router.post('/', function (req, res, next) {
    console.debug("logging in: " + req.body);
    employee_1.Employee.login(req.body.username, req.body.password).then(function (employee) {
        if (employee === null) {
            res.sendStatus(401);
        }
        else {
            req.session.employee = employee;
            res.send(JSON.stringify(employee));
        }
    });
});
//remove funds from the employee's $1000 limit
router.patch('/:username', function (req, res, next) {
    console.debug("Taking $" + req.body.money + " from " + req.params.username);
    employee_service_1.default.removeFunds(req.params.username, Number(req.body.money)).then(function (result) {
        if (result) {
            res.sendStatus(204);
        }
        else {
            res.sendStatus(500);
        }
    });
});
exports.default = router;
// import express from 'express';
// import * as employee from './employee';
// import employeeService from './employee.service';
// //import logger from '../../log';
// const router = express.Router();
// //user logged in validation
// //change req.session.id to req.session.user
// /* GET users listing. */
// router.patch('/', function (req: any, res, next) {
//     employeeService.updateEmployee(req.body).then(() => {
//             if (req.session.user.username === req.body.username) {
//                 req.session.user = req.body;
//                 req.session.save();
//             }
//             console.debug('patch: ' + JSON.stringify(req.session));
//             return true;
//         })
//         .catch((err) => {
//             console.error(err);
//             return false;
//         });
// });
// router.get('/:department-dephead', (req, res, next) => {
//     employeeService.getEmployeeByDepartmentRole(req.params.department).then((data) => {
//             res.send(JSON.stringify(data));
//         })
//         .catch((err) => {
//             console.error(err);
//         });
// });
// router.get('/:username', (req, res, next) => {
//     employeeService.getEmployeeByUsername(req.params.username).then((r) => {
//             res.send(JSON.stringify(r));
//         })
//         .catch((err) => {
//             res.sendStatus(404);
//             console.error(err);
//         });
// });
// router.get('/', (req: any, res, next) => {
//     console.debug('session in get / : ' + JSON.stringify(req.session.user));
//     let u = { ...req.session.user };
//     //delete u.password;
//     res.send(JSON.stringify(u));
// });
// // Legacy route, do not use.
// router.get('/logout', (req, res, next) => {
//     req.session.destroy((err) => console.error(err));
//     res.redirect('/');
// });
// // Much more restful
// router.delete('/', (req, res, next) => {
//     req.session.destroy((err) => {
//         if (err) {
//             console.error(err);
//         }
//     });
//     res.sendStatus(204);
// });
// router.post('/', function (req: any, res, next) {
//     employee.login(req.body.username, req.body.password).then((user) => {
//         if (user === null) {
//             res.sendStatus(401);
//         }
//         req.session.user = user;
//         res.send(JSON.stringify(user));
//     });
// });
// export default router;
// router.get('/:rID', function (req: any, res, next) {
//     //console.log('Attempting to retrieve user');
//     //console.log('Searching for user with username: ' + req.params.rID)
//     if (employee) {
//         res.send(JSON.stringify(employee));
//         console.debug(employee);
//         //res.redirect('/');
//     } else {
//         console.debug('Failed to retrieve employee');
//     }
//     //console.log('Logged in');
// });
// router.post('/', function (req: any, res, next) {
//     console.log(req.body);
//     employee.login(req.body.username, req.body.password).then((employee) => {
//         if (employee === null) {
//             res.sendStatus(401);
//         }
//         req.session.user = employee;
//         res.send(JSON.stringify(employee));
//     });
// });
// router.put('/', function (req, res, next) {
//     console.log('Attempting to update existing user');
//     console.log('Updating existing user with following details: ' + req.params);
//     employeeService.updateEmployee(req.body).then((data) => {
//         res.sendStatus(200);
//         console.log(`The following data is updated \n${data}`);
//     }).catch((err) => {
//         res.sendStatus(500);
//         console.log(`Error: ${err}`)
//     });
// });
// router.delete('/', (req, res, next) => {
//     req.session.destroy((err) => console.log(err));
//     res.sendStatus(204);
// });
// export default router;
