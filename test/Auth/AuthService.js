"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const aws_amplify_1 = require("aws-amplify");
const aws_amplify_2 = require("aws-amplify");
const config_1 = require("./config");
const AWS = require("aws-sdk");
aws_amplify_2.default.configure({
    Auth: {
        mandatorySignIn: false,
        region: config_1.config.REGION,
        userPoolId: config_1.config.USER_POOL_ID,
        userPoolWebClientId: config_1.config.APP_CLIENT_ID,
        identityPoolId: config_1.config.IDENTITY_POOL_ID,
        authenticationFlowType: 'USER_PASSWORD_AUTH',
    }
});
class AuthService {
    async login(userName, password) {
        const user = await aws_amplify_1.Auth.signIn(userName, password);
        return user;
    }
    async getAWSTemporaryCreds(user) {
        const cognitoIdentityPool = `cognito-idp.${config_1.config.REGION}.amazonaws.com/${config_1.config.USER_POOL_ID}`;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config_1.config.IDENTITY_POOL_ID,
            Logins: {
                [cognitoIdentityPool]: user.getSignInUserSession().getIdToken().getJwtToken()
            }
        }, {
            region: config_1.config.REGION
        });
        await this.refreshCredentials();
    }
    async refreshCredentials() {
        return new Promise((resolve, reject) => {
            AWS.config.credentials.refresh(err => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aFNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJBdXRoU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBbUM7QUFDbkMsNkNBQWtDO0FBQ2xDLHFDQUFrQztBQUVsQywrQkFBK0I7QUFHL0IscUJBQU8sQ0FBQyxTQUFTLENBQUM7SUFDZCxJQUFJLEVBQUU7UUFDRixlQUFlLEVBQUUsS0FBSztRQUN0QixNQUFNLEVBQUUsZUFBTSxDQUFDLE1BQU07UUFDckIsVUFBVSxFQUFFLGVBQU0sQ0FBQyxZQUFZO1FBQy9CLG1CQUFtQixFQUFFLGVBQU0sQ0FBQyxhQUFhO1FBQ3pDLGNBQWMsRUFBRSxlQUFNLENBQUMsZ0JBQWdCO1FBQ3ZDLHNCQUFzQixFQUFFLG9CQUFvQjtLQUMvQztDQUNKLENBQUMsQ0FBQTtBQUtGLE1BQWEsV0FBVztJQUdiLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtRQUNqRCxNQUFNLElBQUksR0FBRyxNQUFNLGtCQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQWdCLENBQUM7UUFDbEUsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUdLLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxJQUFpQjtRQUMvQyxNQUFNLG1CQUFtQixHQUFHLGVBQWUsZUFBTSxDQUFDLE1BQU0sa0JBQWtCLGVBQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNoRyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQztZQUN4RCxjQUFjLEVBQUUsZUFBTSxDQUFDLGdCQUFnQjtZQUN2QyxNQUFNLEVBQUU7Z0JBQ0osQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxvQkFBb0IsRUFBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLFdBQVcsRUFBRTthQUNqRjtTQUNKLEVBQUU7WUFDQyxNQUFNLEVBQUUsZUFBTSxDQUFDLE1BQU07U0FDeEIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRU8sS0FBSyxDQUFDLGtCQUFrQjtRQUM1QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBQyxFQUFFO1lBQ2xDLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBMkIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2xELElBQUksR0FBRyxFQUFFO29CQUNMLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtpQkFDZDtxQkFBTTtvQkFDSCxPQUFPLEVBQUUsQ0FBQTtpQkFDWjtZQUNMLENBQUMsQ0FBQyxDQUFBO1FBQ0wsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0NBQ0o7QUFqQ0Qsa0NBaUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXV0aCB9IGZyb20gJ2F3cy1hbXBsaWZ5JztcclxuaW1wb3J0IEFtcGxpZnkgZnJvbSAnYXdzLWFtcGxpZnknO1xyXG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XHJcbmltcG9ydCB7IENvZ25pdG9Vc2VyIH0gZnJvbSAnQGF3cy1hbXBsaWZ5L2F1dGgnO1xyXG5pbXBvcnQgKiBhcyBBV1MgZnJvbSAnYXdzLXNkayc7XHJcbmltcG9ydCB7IENyZWRlbnRpYWxzIH0gZnJvbSAnYXdzLXNkay9saWIvY3JlZGVudGlhbHMnXHJcblxyXG5BbXBsaWZ5LmNvbmZpZ3VyZSh7XHJcbiAgICBBdXRoOiB7XHJcbiAgICAgICAgbWFuZGF0b3J5U2lnbkluOiBmYWxzZSxcclxuICAgICAgICByZWdpb246IGNvbmZpZy5SRUdJT04sXHJcbiAgICAgICAgdXNlclBvb2xJZDogY29uZmlnLlVTRVJfUE9PTF9JRCxcclxuICAgICAgICB1c2VyUG9vbFdlYkNsaWVudElkOiBjb25maWcuQVBQX0NMSUVOVF9JRCxcclxuICAgICAgICBpZGVudGl0eVBvb2xJZDogY29uZmlnLklERU5USVRZX1BPT0xfSUQsXHJcbiAgICAgICAgYXV0aGVudGljYXRpb25GbG93VHlwZTogJ1VTRVJfUEFTU1dPUkRfQVVUSCcsXHJcbiAgICB9XHJcbn0pXHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xyXG5cclxuICAgIFxyXG4gICAgcHVibGljIGFzeW5jIGxvZ2luKHVzZXJOYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpe1xyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBBdXRoLnNpZ25Jbih1c2VyTmFtZSwgcGFzc3dvcmQpIGFzIENvZ25pdG9Vc2VyO1xyXG4gICAgICAgIHJldHVybiB1c2VyO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgIHB1YmxpYyBhc3luYyBnZXRBV1NUZW1wb3JhcnlDcmVkcyh1c2VyOiBDb2duaXRvVXNlcil7XHJcbiAgICAgICBjb25zdCBjb2duaXRvSWRlbnRpdHlQb29sID0gYGNvZ25pdG8taWRwLiR7Y29uZmlnLlJFR0lPTn0uYW1hem9uYXdzLmNvbS8ke2NvbmZpZy5VU0VSX1BPT0xfSUR9YDsgXHJcbiAgICAgICBBV1MuY29uZmlnLmNyZWRlbnRpYWxzID0gbmV3IEFXUy5Db2duaXRvSWRlbnRpdHlDcmVkZW50aWFscyh7XHJcbiAgICAgICAgICAgSWRlbnRpdHlQb29sSWQ6IGNvbmZpZy5JREVOVElUWV9QT09MX0lELFxyXG4gICAgICAgICAgIExvZ2luczoge1xyXG4gICAgICAgICAgICAgICBbY29nbml0b0lkZW50aXR5UG9vbF06IHVzZXIuZ2V0U2lnbkluVXNlclNlc3Npb24oKSEuZ2V0SWRUb2tlbigpLmdldEp3dFRva2VuKClcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9LCB7XHJcbiAgICAgICAgICAgcmVnaW9uOiBjb25maWcuUkVHSU9OXHJcbiAgICAgICB9KTtcclxuICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaENyZWRlbnRpYWxzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyByZWZyZXNoQ3JlZGVudGlhbHMoKTogUHJvbWlzZTx2b2lkPntcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PiB7XHJcbiAgICAgICAgICAgKEFXUy5jb25maWcuY3JlZGVudGlhbHMgYXMgQ3JlZGVudGlhbHMpLnJlZnJlc2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycilcclxuICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfSkgXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufSJdfQ==