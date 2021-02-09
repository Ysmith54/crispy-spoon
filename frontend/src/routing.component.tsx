import React from 'react';
import { Route, Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import LoginComponent from './user/login.component';
import WelcomeComponent from './home.component';
import employeeService from './user/employee.service';
import { EmployeeState } from './reducer';
import { getEmployee } from './actions';
import { Employee, employeeRole } from './user/employee';
import ViewClaimsComponent from './requests/myRequests.component';
import AddClaimComponent from './requests/addRequest.component';
import ErrorBoundaryComponent from './error.component';
import ClaimDetailComponent from './requests/requestDetails.component';

export default function RouterComponent() {

  const employeeSelector = (state: EmployeeState) => state.employee;
  const employee = useSelector(employeeSelector);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  function logout() {
    history.push('/');
    employeeService.logout().then(() => {
      dispatch(getEmployee(new Employee()));
    });
  }

  return (
    <div className='App-header'>
      <nav id="nav" >
        <h1 style={{textAlign:'center'}}> <b>Tuition Reimbursement Management System (TRMS)</b></h1>
        <br></br>
        {employee.username ? (
          <ul>
            <li><a className='link' href='#' onClick={logout}>logout</a></li>
            <li><Link to='/addClaim'>Request for Reimbursement</Link></li>
            <li><Link to='/claims'>View Requests</Link></li>
            {employee.role && employee.role > employeeRole.employee ? (
              <li><Link to='/underlingsclaims'>Approve Requests</Link></li>
            ) : (<></>)}
          </ul>
        ) : (
            <ul style={{textAlign:'center'}}><li><Link to='/login'>Login</Link></li></ul>
          )}
      </nav>
      <main  id="mainsection" className="col offset-3">
        <ErrorBoundaryComponent key={location.pathname}>
          <Route exact path="/" component={WelcomeComponent} />
          <Route path="/login" component={LoginComponent} />
          <Route exact path='/claims' render={() => (<ViewClaimsComponent myClaims={true}/>)}/>
          <Route exact path='/underlingsclaims' render={() => (<ViewClaimsComponent myClaims={false}/>)}/>
          <Route path='/claims/:id' render={(props) => (<ClaimDetailComponent myClaims={true} {...props}/>)}/>
          <Route path='/underlingsclaims/:id' render={(props) => (<ClaimDetailComponent myClaims={false} {...props}/>)}/>
          <Route path='/addclaim' component={AddClaimComponent} />
        </ErrorBoundaryComponent>
      </main>
    </div>
  );
}
