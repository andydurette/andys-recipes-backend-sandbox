import { CognitoUser } from '@aws-amplify/auth';
export declare class AuthService {
    login(userName: string, password: string): Promise<CognitoUser>;
    getAWSTemporaryCreds(user: CognitoUser): Promise<void>;
    private refreshCredentials;
}
