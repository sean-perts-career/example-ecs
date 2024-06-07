import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { contextConfig } from '../lib/context';

export class VpcStack extends Stack {
  public readonly vpc: Vpc;

  constructor(scope: Construct, context: contextConfig, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new Vpc(this, 'Vpc', {
      maxAzs: context.maxAzs,
      subnetConfiguration: [
        {
          cidrMask: context.subnetMask,
          name: 'public',
          subnetType: SubnetType.PUBLIC
        },
        {
          cidrMask: context.subnetMask,
          name: 'private',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS
        }
      ]
    });
  }
}
