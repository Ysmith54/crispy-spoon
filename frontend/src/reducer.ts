import * as Actions from './actions';
import { Claim } from './requests/request';
import { Employee } from './user/employee'

//contains employee who is currently logged in
export interface EmployeeState {
    employee: Employee;
    loginEmployee: Employee;
}

//TODO does claim need to be part of the AppState? Would it be better off as a component state for claimdetail?
export interface ClaimsState {
    myClaims: Claim[];
    underlingsClaims: Claim[];
    claim: Claim;
}

export interface AppState extends EmployeeState, ClaimsState {}

//initial state of application
const initialState: AppState = {
    employee: new Employee(),
    loginEmployee: new Employee(),
    myClaims: [],
    underlingsClaims: [],
    claim: new Claim()
}

//TODO decide if you want multiple reducers for different roles
const reducer = (state: AppState = initialState, action: Actions.AppAction): AppState => {
    const newState = {...state};

    switch(action.type) {
        case Actions.EmployeeActions.GetEmployee:
            newState.employee = action.payload as Employee;
            return newState;
        case Actions.ClaimActions.GetClaims:
            newState.myClaims = action.payload as Claim[];
            return newState;
        case Actions.EmployeeActions.LoginChange:
            newState.loginEmployee = action.payload as Employee;
            return newState;
        case Actions.ClaimActions.GetUnderlingsClaims:
            newState.underlingsClaims = action.payload as Claim[];
            return newState;
        default:
            return state;
    }
}

export default reducer;



// export interface UserState {
//     employee: Employee;
// }

// export interface RequestState {
//     requests: Request[];
//     request: Request;
// }

// export interface AppState extends UserState, RequestState {}

// const initialState: AppState = {
//     employee: new Employee(),
//     requests: [],
//     request: new Request()

// }

// const reducer = (state: AppState = initialState, action: Actions.AppAction): AppState => {
//     console.log(action);
//     const newState = {...state};

//     switch (action.type) {
//         case Actions.UserActions.GetUser:
//             console.log(action.type);
//             newState.employee = action.payload as Employee;
//             return newState;
//         case Actions.RequestActions.GetRequests:
//             console.log(action.type);
//             newState.requests = action.payload as Request[];
//             return newState;
//         case Actions.RequestActions.GetRequest:
//             console.log(action.type);
//             newState.request = action.payload as Request;
//             return newState;
//         case Actions.RequestActions.UpdateRequest:
//             console.log(action.type);
//             newState.request = action.payload as Request;
//             console.log('Action payload: ' + newState.request);
//             return newState;
//         default:
//             console.log('No action given');
//             return state;
//     }
// }

// export default reducer;
