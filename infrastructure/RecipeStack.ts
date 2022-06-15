import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { CfnUserPoolGroup } from 'aws-cdk-lib/aws-cognito';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { 
Stack, StackProps, Expiration, Duration, 
aws_lambda, CfnOutput, aws_cognito, aws_dynamodb, aws_iam, Fn 
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import path = require('path');

export class RecipeStack extends Stack {

    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props)
 
        // Step 1. Create user pool
        const userPool = new aws_cognito.UserPool(this, 'RecipeUserPool', {
            userPoolName: 'RecipeUserPool',
            selfSignUpEnabled: true,
            accountRecovery: aws_cognito.AccountRecovery.PHONE_AND_EMAIL,
            userVerification: {
                emailStyle: aws_cognito.VerificationEmailStyle.CODE
            },
            autoVerify: {
                email: true
            },
            standardAttributes: {
                email: {
                required: true,
                mutable: true
                }
            }
        })
      
        // Step 2. Initialize userPoolClient
        const userPoolClient = new aws_cognito.UserPoolClient(this, "UserPoolClient", {
            userPool,
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userPassword: true,
                userSrp: true,
              },
            supportedIdentityProviders: [
                aws_cognito.UserPoolClientIdentityProvider.COGNITO,
            ],
        })

        

        // test //

        // 👇 Identity Pool
        const identityPool = new aws_cognito.CfnIdentityPool(this, 'identity-pool', {
            identityPoolName: 'my-identity-pool',
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders: [
            {
                clientId: userPoolClient.userPoolClientId,
                providerName: userPool.userPoolProviderName,
            },
            ],
        });

        const isAnonymousCognitoGroupRole = new aws_iam.Role(
            this,
            'anonymous-group-role',
            {
              description: 'Default role for anonymous users',
              assumedBy: new aws_iam.FederatedPrincipal(
                'cognito-identity.amazonaws.com',
                {
                  StringEquals: {
                    'cognito-identity.amazonaws.com:aud': identityPool.ref,
                  },
                  'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'unauthenticated',
                  },
                },
                'sts:AssumeRoleWithWebIdentity',
              ),
              managedPolicies: [
                aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
                  'service-role/AWSLambdaBasicExecutionRole',
                ),
              ],
            },
          );
      
          const isUserCognitoGroupRole = new aws_iam.Role(this, 'users-group-role', {
            description: 'Default role for authenticated users',
            assumedBy: new aws_iam.FederatedPrincipal(
              'cognito-identity.amazonaws.com',
              {
                StringEquals: {
                  'cognito-identity.amazonaws.com:aud': identityPool.ref,
                },
                'ForAnyValue:StringLike': {
                  'cognito-identity.amazonaws.com:amr': 'authenticated',
                },
              },
              'sts:AssumeRoleWithWebIdentity',
            ),
            managedPolicies: [
                aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
                'service-role/AWSLambdaBasicExecutionRole',
              ),
            ],
          });

          const adminRole = new aws_iam.Role(this, 'users-group-admin-role', {
            description: 'Admin role for authenticated users',
            assumedBy: new aws_iam.FederatedPrincipal(
              'cognito-identity.amazonaws.com',
              {
                StringEquals: {
                  'cognito-identity.amazonaws.com:aud': identityPool.ref,
                },
                'ForAnyValue:StringLike': {
                  'cognito-identity.amazonaws.com:amr': 'authenticated',
                },
              },
              'sts:AssumeRoleWithWebIdentity',
            ),
            managedPolicies: [
                aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
                'service-role/AWSLambdaBasicExecutionRole',
              ),
            ],
          });

          new aws_cognito.CfnIdentityPoolRoleAttachment(
            this,
            'identity-pool-role-attachment',
            {
              identityPoolId: identityPool.ref,
              roles: {
                authenticated: isUserCognitoGroupRole.roleArn,
                unauthenticated: isAnonymousCognitoGroupRole.roleArn,
              },
              roleMappings: {
                mapping: {
                  type: 'Token',
                  ambiguousRoleResolution: 'AuthenticatedRole',
                  identityProvider: `cognito-idp.${
                    Stack.of(this).region
                  }.amazonaws.com/${userPool.userPoolId}:${
                    userPoolClient.userPoolClientId
                  }`,
                },
              },
            },
          );

          new CfnUserPoolGroup(this, "adminRole", {
            groupName: "Admin",
            userPoolId: userPool.userPoolId
          });

        // test //
    
        // Step 3. Create an appsync endpoint
        const api = new appsync.GraphqlApi(this, 'cdk-recipe-app', {
        name: "cdk-recipe-api",
        logConfig: {
            fieldLogLevel: appsync.FieldLogLevel.ALL,
        },
        schema: appsync.Schema.fromAsset(path.join(__dirname,'../graphql/schema.graphql')),
        authorizationConfig: {
            defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: {
                expires: Expiration.after(Duration.days(365))
            }
            },
            additionalAuthorizationModes: [{
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
                userPool,
            }
            }]
        },
        })
      
         
        // Step 4. Create the dynamoDB table
        const recipeTable = new aws_dynamodb.Table(this, 'CDKRecipeTable', {
        billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
        partitionKey: {
            name: 'id',
            type: aws_dynamodb.AttributeType.STRING,
        },
        })
          
            // Step 4. Addition - Add a global secondary index to enable another data access pattern
            recipeTable.addGlobalSecondaryIndex({
            indexName: "recipesByCuisine",
            partitionKey: {
                name: "cuisine",
                type: aws_dynamodb.AttributeType.STRING,
            }
            })

        // Step 5. Take typescript lambda's and export them to formation as one
        // one combined lambda
        const recipeLambda = new NodejsFunction(this, 'AppSyncRecipeHandler', {
        runtime: aws_lambda.Runtime.NODEJS_16_X,
        entry: path.join(__dirname, '../lambda-fns/main.ts'),
        handler: 'handler',
        memorySize: 1024,
        environment: {
            RECIPE_TABLE: recipeTable.tableName
        }
        })
          
          // Step 5. Addition - Create the graphql endpoint that will communicate with dynamodb table
          // Set the new Lambda function as a data source for the AppSync API
          const lambdaDs = api.addLambdaDataSource('lambdaDatasource', recipeLambda)
      
          lambdaDs.createResolver({
            typeName: "Query",
            fieldName: "getRecipeById"
          })
          
          lambdaDs.createResolver({
            typeName: "Query",
            fieldName: "listRecipes"
          })
          
          lambdaDs.createResolver({
            typeName: "Query",
            fieldName: "recipesByCuisine"
          })
          
          lambdaDs.createResolver({
            typeName: "Mutation",
            fieldName: "createRecipe"
          })
          
          lambdaDs.createResolver({
            typeName: "Mutation",
            fieldName: "deleteRecipe"
          })
          
          lambdaDs.createResolver({
            typeName: "Mutation",
            fieldName: "updateRecipe"
          })
          
          // Enable the Lambda function to access the DynamoDB table (using IAM)
          recipeTable.grantFullAccess(recipeLambda)
          
          // Create an environment variable that we will use in the function code
          recipeLambda.addEnvironment('RECIPE_TABLE', recipeTable.tableName)


    // Step 6. Create a s3 bucket for holding recipe images
    // Step 6 - Addition buckets need unique names use stack name for unique value
    
    const shortStackId = Fn.select(2, Fn.split('/', this.stackId));
    const Suffix = Fn.select(4, Fn.split('-', shortStackId));
    

    const recipesPhotosBucket = new Bucket(this, 'recipes-photos', {
        bucketName: 'recipes-photos-' + Suffix,
        cors: [{
            allowedMethods:[
                HttpMethods.HEAD,
                HttpMethods.GET,
                HttpMethods.PUT
            ],
            allowedOrigins: ['*'],
            allowedHeaders: ['*']
        }]
    });

    // Step 6 - Admins need access to the bucket to add images
    adminRole.addToPolicy(new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
            's3:PutObject',
            's3:PutObjectAcl'
        ],
        resources: [recipesPhotosBucket.bucketArn]
    }))

    // Step 6. Outputs for Giving to FrontEnd Amplify
    new CfnOutput(this, 'userPoolId', {value: userPool.userPoolId});
    new CfnOutput(this, 'userPoolClientId', {value: userPoolClient.userPoolClientId});
    new CfnOutput(this, 'identityPoolId', {value: identityPool.ref});
    new CfnOutput(this, 'graphQlApiEndpoint', {value: api.graphqlUrl});
    new CfnOutput(this, 'recipes-photos-bucket-name', {value: recipesPhotosBucket.bucketName})
    }
}