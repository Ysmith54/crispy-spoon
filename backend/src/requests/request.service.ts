
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from '../dynamo/dynamo';
import { Claim, claimStatus } from './request';

class ClaimService {
    private doc: DocumentClient;

    constructor() {
        this.doc = dynamo;
    }

    //GET CLAIMS BY REQUESTOR'S NAME
    async getClaimsByUsername(username: string): Promise<Claim[] | null> {
        // GetItem api call allows us to get something by the key
        const params = {
            TableName: 'claims',
            KeyConditionExpression: '#claimer=:claimer',
            ExpressionAttributeNames: {
                '#claimer': 'claimer'
            },
            ExpressionAttributeValues: {
                ':claimer': username
            }
        };
        return await this.doc.query(params).promise().then((data) => {
            if (data && data.Items) {
                return data.Items as Claim[];
            } else {
                return null;
            }
        });
    }

    //GET CLAIM REQUESTS BY APPROVAL
    async getClaimsByClaimee(username: string): Promise<Claim[] | null> {
        const params = {
            TableName: 'claims',
            IndexName: 'claimeeIdIndex',
            KeyConditionExpression: '#claimee=:claimee',
            ExpressionAttributeNames: {
                '#claimee': 'claimee'
            },
            ExpressionAttributeValues: {
                ':claimee': username
            }
        };
        return await this.doc.query(params).promise().then((data) => {
            if (data && data.Items) {
                console.debug(`getClaimsByClaimee data: ${JSON.stringify(data.Items)}`);
                return data.Items as Claim[];
            } else {
                return null;
            }
        }).catch((err) => {
            console.error(err);
            return null;
        });
    }

    async getClaimsByInfoFrom(username: string): Promise<Claim[] | null> {
        const params = {
            TableName: 'claims',
            IndexName: 'infoIdIndex',
            KeyConditionExpression: '#infoFrom=:infoFrom',
            ExpressionAttributeNames: {
                '#infoFrom': 'infoFrom'
            },
            ExpressionAttributeValues: {
                ':infoFrom': username
            }
        };
        return await this.doc.query(params).promise().then((data) => {
            if (data && data.Items) {
                console.debug(`getClaimsByInfoFrom data: ${JSON.stringify(data.Items)}`);
                return data.Items as Claim[];
            } else {
                return null;
            }
        }).catch((err) => {
            console.error(err);
            return null;
        });
    }

    //INSTEAD OF OVERWRITING THE REQUESTED CLAIM, COMPLETELY REPLACE IT
    async updateClaim(claim: Claim): Promise<boolean> {
        await this.deleteClaim(claim.id, claim.claimer);
        await this.addClaim(claim);
        return true;
    }

    //REMOVE CLAIMS
    async deleteClaim(id: number, claimer: string): Promise<boolean> {
        // Delete the claim
        const params = {
            TableName: 'claims',
            Key: {
                'claimer': claimer,
                'id': id
            }
        }

        await this.doc.delete(params).promise();
        return true;
    }

    //ADD CLAIMS
    async addClaim(claim: Claim): Promise<boolean> {
        const params = {
            TableName: 'claims',
            Item: claim,
            ConditionExpression: '#id <> :id',
            ExpressionAttributeNames: {
                '#id': 'id',
            },
            ExpressionAttributeValues: {
                ':id': claim.id,
            }
        };

        return this.doc.put(params).promise().then(() => {
            console.info(`Successfully added claim ${claim.id} to the DynamoDB`);
            return true;
        }).catch((error) => {
            console.error(`Could not add claim to table: ${error}`);
            return false;
        });
    }

    //RETRIEVE CLAIM REQUESTS BY THEIR ID - perspective of employee making claim
    async getMyClaimById(username: string, id: number): Promise<Claim | null> {
        const params = {
            TableName: 'claims',
            Key: {
                'claimer': username,
                'id': id
            }
        };
        return await this.doc.get(params).promise().then((data) => {
            if (data && data.Item) {
                return data.Item as Claim;
            } else {
                return null;
            }
        }).catch(err => {
            console.error(err);
            return null;
        })
    }

    //RETRIEVE CLAIM REQUESTS BY THEIR ID - perspective of assigned supervisors viewing claim
    async getUClaimById(username: string, id: number): Promise<Claim | null> {
        const params = {
            TableName: 'claims',
            IndexName: 'claimeeIdIndex',
            KeyConditionExpression: '#claimee = :claimee and #id = :id',
            ExpressionAttributeValues: {
                ':claimee': username,
                ':id': id
            },
            ExpressionAttributeNames: {
                '#claimee': 'claimee',
                '#id': 'id'
            }
        };
        return await this.doc.query(params).promise().then((data) => {
            if (data && data.Items) {
                console.debug(`getClaimsByClaimee data: ${JSON.stringify(data.Items)}`);
                return data.Items[0] as Claim;
            } else {
                return null;
            }
        }).catch((err) => {
            console.error(err);
            return null;
        });
    }

        //RETRIEVE CLAIM REQUESTS BY THEIR DETAILS ID
    async getClaimByInfoId(username: string, id: number): Promise<Claim | null> {
        const params = {
            TableName: 'claims',
            IndexName: 'infoIdIndex',
            KeyConditionExpression: '#infoFrom = :infoFrom and #id = :id',
            ExpressionAttributeValues: {
                ':infoFrom': username,
                ':id': id
            },
            ExpressionAttributeNames: {
                '#infoFrom': 'infoFrom',
                '#id': 'id'
            }
        };
        return await this.doc.query(params).promise().then((data) => {
            if (data && data.Items) {
                console.debug(`getClaimsByInfoFrom data: ${JSON.stringify(data.Items)}`);
                return data.Items[0] as Claim;
            } else {
                return null;
            }
        }).catch((err) => {
            console.error(err);
            return null;
        });
    }

//RETRIEVE ALL REQUESTS THAT ARE PENDING
    async getAllClaims(): Promise<Claim[]> {
        const params = {
            TableName: 'claims',
            FilterExpression: '#status < :benCoApproval',
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':benCoApproval': claimStatus.pending
            }
        };
        return await this.doc.scan(params).promise().then((data) => {
            return data.Items as Claim[];
        }).catch((err) => {
            console.error(err);
            return [] as Claim[];
        })
    }
}

const claimService = new ClaimService();
export default claimService;