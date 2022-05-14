import { Bucket } from 'aws-cdk-lib/aws-s3';
import { CfnOutput, Stack } from "aws-cdk-lib";
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { join } from 'path';
import { CloudFrontWebDistribution } from 'aws-cdk-lib/aws-cloudfront';




export class WebAppDeployment {

    private stack: Stack;
    private bucketSuffix: string;
    private deploymentBucket: Bucket;

    constructor(stack:Stack, bucketSuffix: string){
        this.stack = stack;
        this.bucketSuffix = bucketSuffix;
        this.initialize();
    }

    private initialize(){
        const bucketName = 'recipe-app-web' + this.bucketSuffix;
        this.deploymentBucket = new Bucket(
            this.stack,
            'recipe-app-web-id', {
               bucketName: bucketName,
               publicReadAccess: true,
               websiteIndexDocument: 'index.html'
            }
        );
        new BucketDeployment(
            this.stack,
            'recipe-app-web-id-deployment', {
                destinationBucket: this.deploymentBucket,
                sources: [
                    Source.asset(
                        join(__dirname, '..', '..', 'andys-recipes-frontend', 'build')
                    )
                ]
            }
        );
        new CfnOutput(this.stack, 'recipesWebAppS3Url',{
            value: this.deploymentBucket.bucketWebsiteUrl
        });

        const cloudFront = new CloudFrontWebDistribution(
            this.stack,
            'recipe-app-web-distribution', {
                originConfigs:[
                    {
                        behaviors: [
                            {
                            isDefaultBehavior: true
                            }
                        ],
                        s3OriginSource: {
                            s3BucketSource: this.deploymentBucket
                        }
                    }
                ]
            }
        );
        new CfnOutput(this.stack, 'recipesWebAppCloudFrontUrl', {
            value: cloudFront.distributionDomainName
        })
    }
}