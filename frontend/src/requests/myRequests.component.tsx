import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ClaimsState } from "../reducer";
import { Claim } from "./request";

interface ViewClaimsProps {
    myClaims: boolean;
}

function ViewClaimsComponent(props: ViewClaimsProps) {
    let claimsSelector;
    let h2Text: string;
    let linkURI: string;
    if(props.myClaims) {
        claimsSelector = (state: ClaimsState) => state.myClaims;
        h2Text = 'Reimbursement Requests';
        linkURI = '/claims/';
    } else {
        claimsSelector = (state: ClaimsState) => state.underlingsClaims;
        h2Text = 'Reimbursement request(s) for approval';
        linkURI = '/underlingsclaims/';
    }
    const claims = useSelector(claimsSelector);

    //Attempted urgency notification to prioritize claim requests
    //if the start date is within 2 weeks
    const twoWeeksAway = 12096e5;

    return (
        <div style={{alignContent: 'space-evenly'}}>
            <h2>{h2Text}</h2>
            <br/>
            <table className='tableForm'>
                <thead>
                <tr>
                    <th>
                        Requestor
                    </th>
                    <th>
                        Date Submitted
                    </th>
                    <th>
                        Course Name
                    </th>
                    <th >
                        Status
                    </th>
                    <th>
                        View Details
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {claims.map((claim) => {
                        return (
                            <tr key={claim.id} className={new Date(claim.startDate).getTime() - new Date().getTime() > twoWeeksAway ? '' : 'warning'}>
                                <td key='claimer'>
                                    {claim.claimer}
                                </td>
                                <td key='id' align='center'>
                                    {new Date(claim.id).toLocaleDateString()}
                                </td>
                                <td key='courseName' align='center'>
                                    {claim.courseName}
                                </td>
                                <td key='status' align='center'>
                                    {Claim.statusTextLong(claim)}
                                </td>
                                <td key='details' align='center'>
                                    <Link to={linkURI+claim.id}>Details</Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default ViewClaimsComponent;
