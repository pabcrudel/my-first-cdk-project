import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { website } from './website-construct';

// Project name
const mainName = "my-first-cdk-project";

export class MyProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new website(this, mainName);
  }
}
