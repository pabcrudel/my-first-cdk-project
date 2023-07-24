#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MyProjectStack } from '../lib/my-project-stack';

const app = new cdk.App();
new MyProjectStack(app, 'MyProjectStack', {
});