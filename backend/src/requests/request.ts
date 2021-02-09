import { Employee, employeeRole } from '../employees/employee';
import employeeService from '../employees/employee.service';
import claimService from './request.service';
//modified to use classes instead of interfaces

export enum gradeType {
    letter = 'A-F',
    GPA = 'GPA',
    passFail = 'Pass or Fail',
    percentage = 'Percentage',
    none = 'None'
}

export enum courseType {
    universityCourse = 'University Course',
    seminar = 'Seminar',
    certificationPrep = 'Certification Prep',
    certification = 'Certification',
    technicalTraining = 'Technical Training',
    miscellaneous = 'Other'
}

export enum claimStatus {
    open = employeeRole.employee,
    approvedBySupervisor = employeeRole.supervisor,
    approvedByDeptHead = employeeRole.departmentHead,
    pending = employeeRole.benCo,
    gradesProvided,
    awarded,
    denied,
    infoRequired
}

export class Claim {

    
    public infoRequired = '';
    public infoFrom: string;
    public infoProvided = '';

    public denialReason = '';

    public approvedBy: string[] = [];

    readonly id: number;
    public estimatedReimbursement: number;
    public grade: string = '';
    public increasedReimbursementReason?: string;

    constructor(readonly claimer: string,
        public claimee: string,
        public courseName: string,
        public type: courseType,
        public grading: gradeType,
        public passingGrade: string,
        public startDate: string,
        public startTime: string,
        public cost: number,
        public description: string,
        public justification: string,
        remainingFunds: number = 1000,
        public status: claimStatus = claimStatus.open) {

        this.id = Date.now();
        this.estimatedReimbursement = Claim.expectedReimbursement(cost, type, remainingFunds);
        this.approvedBy.push(claimer);
        this.infoFrom = claimer;
    }

    //Calculate the expected reimbursement for course type
    public static expectedReimbursement(cost: number, type: courseType, remainingFunds: number): number {
        let reimbursement = 0;
        switch(type) {
            case courseType.universityCourse:
                reimbursement = 0.8 * cost;
                break;
            case courseType.seminar:
                reimbursement = 0.6 * cost;
                break;
            case courseType.certificationPrep:
                reimbursement = 0.75 * cost;
                break;
            case courseType.certification:
                reimbursement = cost;
                break;
            case courseType.technicalTraining:
                reimbursement = 0.9 * cost;
                break;
            default:
                reimbursement = 0.3 * cost;
                break;
        }
        return reimbursement > remainingFunds ? remainingFunds : reimbursement;
    }

    //Approve the claim
    public static approve(claim: Claim, approvingEmployee: Employee) {
        console.debug(`Approving claim ${claim.id}`);
        claim.status = Number(approvingEmployee.role);
        claim.approvedBy.push(approvingEmployee.username);

        if (approvingEmployee.role !== employeeRole.benCo) {
            // not at the HR/BenCo yet - keep sending the response up the chain
            claim.claimee = String(approvingEmployee.immediateBoss);
        }
        if (claim.grade && (approvingEmployee.role === employeeRole.benCo || claim.grading === gradeType.none)) {
            // Employee has submitted grades/presentation, HR/BenCo awards them
            claim.status = claimStatus.awarded;
        } else if (approvingEmployee.role === employeeRole.benCo) {
            //Until employee submits grade, although approved, it will remain pending until grade is submitted
            employeeService.removeFunds(claim.claimer, claim.estimatedReimbursement);
        }
    }
}
