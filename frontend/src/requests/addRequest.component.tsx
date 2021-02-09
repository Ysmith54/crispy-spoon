import { SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getClaims } from '../actions';
import claimService from './request.service';
import { Claim, courseType, gradeType } from './request';
import GradeComponent from './gradeFormat.component';
import { Button } from 'react-bootstrap';

function AddClaimComponent(this: any, props: any) {
    const dispatch = useDispatch();
    const history = useHistory();

    //state is keeping track of claim request
    const [claim, setClaim] = useState(new Claim());
    const tempClaim = claim;
    const [estReimbursement, setEstReimbursement] = useState(0);

    //using claim.grading gets its own state
    const [gradingType, setGradingType] = useState(claim.grading);

    const date = new Date();
    date.setDate(date.getDate() + 7);
    const minDate = `${date.toISOString().substring(0, 10)}`;

    function handleFormInput(e: SyntheticEvent) {
        if ((e.target as HTMLInputElement).name === 'coursename') {
            tempClaim.courseName = (e.target as HTMLInputElement).value;
            setClaim(tempClaim);
        } else if ((e.target as HTMLSelectElement).name === 'coursetype') {
            tempClaim.type = (e.target as HTMLSelectElement).value as courseType;
            setClaim(tempClaim);
            getEstReimbursement();
        } else if ((e.target as HTMLSelectElement).name === 'gradetype') {
            tempClaim.grading = (e.target as HTMLSelectElement).value as gradeType;
            tempClaim.passingGrade = Claim.getDefaultPassGrade(tempClaim.grading);
            setClaim(tempClaim);
            setGradingType(tempClaim.grading);
        } else if ((e.target as HTMLSelectElement).name === 'grade') {
            tempClaim.passingGrade = (e.target as HTMLSelectElement).value as string;
            setClaim(tempClaim);
        } else if ((e.target as HTMLInputElement).name === 'startdate') {
            tempClaim.startDate = (e.target as HTMLInputElement).value;
            setClaim(tempClaim);
        } else if ((e.target as HTMLInputElement).name === 'starttime') {
            tempClaim.startTime = (e.target as HTMLInputElement).value;
            setClaim(tempClaim);
        } else if ((e.target as HTMLInputElement).name === 'cost') {
            tempClaim.cost = Number((e.target as HTMLInputElement).value);
            setClaim(tempClaim);
            getEstReimbursement();
        } else if ((e.target as HTMLInputElement).name === 'description') {
            tempClaim.description = (e.target as HTMLInputElement).value;
            setClaim(tempClaim);
        } else if ((e.target as HTMLInputElement).name === 'justification') {
            tempClaim.justification = (e.target as HTMLInputElement).value;
            setClaim(tempClaim);
        }
    }

    function getEstReimbursement() {
        claimService.getEstReimbursement(claim).then((result) => {
            setEstReimbursement(result);
        });
    }

    function submitForm() {
        if(Claim.hasRequiredFields(claim)) {
            console.log('passed hasRequiredFields');
            claimService.addMyClaim(claim).then(() => {
                claimService.getMyClaims().then((claims) => {
                    dispatch(getClaims(claims));
                    history.push('/claims');
                });
            });
        } else {
            console.log('failed hasRequiredFields');
            let emptyFields = document.getElementById('emptyFieldsMessage');
            if (emptyFields) {
                emptyFields.innerText = 'Some required fields empty: please enter all required information and try again';
            }
        }
    }

    //create div component to hold element
    return (
        <div  style={{alignContent: 'space-evenly'}}>
            Course name<input required={true} type='text' className='form-control' onChange={handleFormInput} name='coursename' />
            <br />
            <p> </p>
            Course type<select defaultValue={claim.type} onChange={handleFormInput} name='coursetype'>
                <option value={courseType.universityCourse}>{courseType.universityCourse}</option>
                <option value={courseType.seminar}>{courseType.seminar}</option>
                <option value={courseType.certificationPrep}>{courseType.certificationPrep}</option>
                <option value={courseType.certification}>{courseType.certification}</option>
                <option value={courseType.technicalTraining}>{courseType.technicalTraining}</option>
                <option value={courseType.miscellaneous}>{courseType.miscellaneous}</option>
            </select>
            <br />
            <p> </p>
            Grading type<select defaultValue={claim.grading} onChange={handleFormInput} name='gradetype'>
                <option value={gradeType.letter}>{gradeType.letter}</option>
                <option value={gradeType.GPA}>{gradeType.GPA}</option>
                <option value={gradeType.passFail}>{gradeType.passFail}</option>
                <option value={gradeType.percentage}>{gradeType.percentage}</option>
                <option value={gradeType.none}>{gradeType.none}</option>
            </select>

            Passing grade<GradeComponent gradingType={gradingType} handleFormInput={handleFormInput}></GradeComponent>
            <p> </p>
            Start date<input type='date' min={minDate} className='form-control' onChange={handleFormInput} name='startdate' />
            <br />
            <p> </p>
            Start time<input type='time' className='form-control' onChange={handleFormInput} name='starttime' />
            <br />
            <p> </p>
            Cost<input type='number' className='form-control' onChange={handleFormInput} name='cost' />
            <br />
            <p> </p>
            Course Description<input type='text' className='form-control' onChange={handleFormInput} name='description' />
            <br />
            <p> </p>
            Justification<input type='text' className='form-control' onChange={handleFormInput} name='justification' />
            <br />
            <p><b>Calculated Reimbursement:</b> ${estReimbursement.toFixed(2)}</p>
            <br />
            <button className='btn btn-danger' onClick={submitForm}>Submit Request</button>
            <p className='warning' id='emptyFieldsMessage'></p>
        </div>
    );
}

export default AddClaimComponent;