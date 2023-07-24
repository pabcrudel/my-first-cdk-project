import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class MyWebsite extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creates the s3 bucket where the website will be hosted
    const webBucket = new s3.Bucket(this, 's3-hosting', {
      bucketName: "my-website-bucket-24-07-2023",
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'cloudfront-oai', {
      comment: 'Allows CloudFront to reach the web bucket',
    })

    // Add a bucket policy to allow read access from CloudFront
    webBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [webBucket.bucketArn + '/*'],
      principals: [originAccessIdentity.grantPrincipal],
    }));

    // Creates the cloudfront distribution that will be on top of the s3 bucket
    const webDistribution = new cloudfront.CloudFrontWebDistribution(this, 'cloudfront-distribution', {
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
    })

    // This function deploys the built files from the frontend to the s3 hosting the website
    new s3deploy.BucketDeployment(this, 's3-deploy', {
      sources: [s3deploy.Source.asset('./www'),],
      prune: false,
      destinationBucket: webBucket,
      distribution: webDistribution,
      distributionPaths: ['/index.html'],
    })
  }
}
