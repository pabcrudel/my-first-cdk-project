import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';

export class MyWebsite extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creates the s3 bucket where the website will be hosted
    const webBucket = new s3.Bucket(this, 's3-hosting', {
      bucketName: "my-website-bucket-24-07-2023",
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
    })

    // Creates the cloudfront distribution
    const distribution = new cloudfront.Distribution(this, 'cloudfront-web-distribution', {
      defaultRootObject: "index.html",
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      defaultBehavior: {
        origin: new cloudfront_origins.S3Origin(webBucket), // This class automatically creates an Origin Access Identity
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    // This function deploys the built files from the frontend to the s3 hosting the website
    new s3deploy.BucketDeployment(this, 's3-deploy', {
      sources: [s3deploy.Source.asset('./www'),],
      prune: false,
      destinationBucket: webBucket,
      distribution: distribution,
    })
  }
}
