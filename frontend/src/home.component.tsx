
function HomeComponent() {
    //Provides a couple of basic paragraphs so the site isn't completely blank before/after logging in
    return (
        <div style={{textAlign: 'center'}}>
            <h3>Welcome to TRMS</h3>
            <p><i> Get rewarded for further advancing your software and tech skills</i></p>
            <ul>
                <li>** 100% reimbursement for certifications **</li>
                <li>** 90% reimbursement for technical training **</li>
                <li>** 80% reimbursement for university courses **</li>
                <li>** 75% reimbursement for certification preparation classes **</li>
                <li>** 60% reimbursement for seminars **</li>
                <li>** 30% reimbursement for miscellaneous education **</li>
            </ul>
            <h6><i>Employee may only spend up to 1000 credits</i></h6>
        </div>
    )
}

export default HomeComponent;