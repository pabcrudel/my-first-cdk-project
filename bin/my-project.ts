#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MyProjectStack } from '../lib/my-project-stack';

const app = new cdk.App();
new MyProjectStack(app, 'my-first-cdk-project', {
    env: {
        region: process.env.CDK_DEFAULT_REGION,
        account: process.env.CDK_DEFAULT_ACCOUNT,
    },
});