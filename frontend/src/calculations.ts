export function idGen(numLength: number) {
    let id: string = ""
    for (let i: number = 0; i < numLength; ++i) {
        id += Math.floor(Math.random() * 10);
    }
    return id;
}

export function calculateRequestAmount(amount: number, eventType: string): number {
    let uniPercent: number = 0.8;
    let seminarPercent: number = 0.6;
    let certPrepPercent: number = 0.75;
    let certPercent: number = 1;
    let techTraingPercent: number = 0.9;
    let otherPercent: number = 0.3;

    //according to event type calculate the amount of reimbursement that can returned
    switch (eventType) {
        case 'University':
            return (amount * uniPercent);
        case 'Seminar':
            return (amount * seminarPercent);
        case 'CertPrep':
            return (amount * certPrepPercent);
        case 'Cert':
            return (amount * certPercent);
        case 'TechTraining':
            return (amount * techTraingPercent);
        case 'Other':
            return (amount * otherPercent);
        default:
            return 0;
    }
}