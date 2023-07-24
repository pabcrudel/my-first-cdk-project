import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import { Construct } from 'constructs';

// Creates s3 Bucket

// Project name
const mainName = "my-first-cdk-project";

export class web extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id)

        // Creates the s3 bucket where the website will be hosted
        const webBucket = new s3.Bucket(this, `${mainName}-hosting`, {
            publicReadAccess: false,
            bucketName: `${mainName}-bucket`,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: '404.html',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        })

        const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, `${mainName}-oai`, {
            comment: 'Allows CloudFront to reach the web bucket',
        })

        // Creates the cloudfront distribution that will be on top of the s3 bucket
        const webDistribution = new cloudfront.CloudFrontWebDistribution(this, `${mainName}-distribution`, {
            defaultRootObject: '/index.html',
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: webBucket,
                        originAccessIdentity: originAccessIdentity,
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                },
            ],
            errorConfigurations: [
                {
                    errorCode: 403,
                    responsePagePath: '/index.html',
                    responseCode: 200,
                },
            ],
        })

        /** This function deploys the built files from the frontend to the s3 hosting the website */
        const webdeploy = new s3deploy.BucketDeployment(this, `${mainName}-deploy`, {
            sources: [
                s3deploy.Source.asset('./www'),
            ],
            prune: false,
            destinationBucket: webBucket,
            distribution: webDistribution,
            distributionPaths: ['/index.html'],
        })
    }
}