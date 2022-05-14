import { CfnOutput } from 'aws-cdk-lib';
import { Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';
import { AuthorizationType, Cors, LambdaIntegration, MethodOptions, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { GenericTable } from './GenericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { AuthorizerWrapper} from './auth/AuthorizerWrapper';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { WebAppDeployment } from './WebAppDeployment';

export class RecipeStack extends Stack {

    private api = new RestApi(this, 'RecipeApi');
    private authorizer: AuthorizerWrapper;
    private suffix: string;
    private recipesPhotosBucket: Bucket;

    private recipesTable = new GenericTable(this, {
        tableName: 'RecipesTable',
        primaryKey: 'recipeId',
        createLambdaPath: 'Create',
        readLambdaPath: 'Read',
        updateLambdaPath: 'Update',
        deleteLambdaPath: 'Delete',
        secondaryIndexes: ['cuisine']
    });

    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props)
 
        this.initializeSuffix();
        this.initializeRecipesPhotosBucket();
        this.authorizer = new AuthorizerWrapper(
            this, 
            this.api,
            this.recipesPhotosBucket.bucketArn + '/*'
            );
        new WebAppDeployment(this, this.suffix)

        const optionsWithAuthorizer: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: this.authorizer.authorizer.authorizerId
            }
        }

        const optionsWithCors:ResourceOptions = {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS
            }
        }

        //Recipes API integrations:
        const recipeResource = this.api.root.addResource('recipes', optionsWithCors);
        recipeResource.addMethod('POST', this.recipesTable.createLambdaIntegration);
        recipeResource.addMethod('GET', this.recipesTable.readLambdaIntegration);
        recipeResource.addMethod('PUT', this.recipesTable.updateLambdaIntegration)
        recipeResource.addMethod('DELETE', this.recipesTable.deleteLambdaIntegration)
    }

    private initializeSuffix(){
        const shortStackId = Fn.select(2, Fn.split('/', this.stackId));
        const Suffix = Fn.select(4, Fn.split('-', shortStackId));
        this.suffix = Suffix;
    }
    private initializeRecipesPhotosBucket(){
        this.recipesPhotosBucket = new Bucket(this, 'recipes-photos', {
            bucketName: 'recipes-photos-' + this.suffix,
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
        new CfnOutput(this, 'recipes-photos-bucket-name', {
            value: this.recipesPhotosBucket.bucketName
        })
    }
}