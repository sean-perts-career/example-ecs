import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { contextConfig } from '../lib/context';

export class EcrStack extends Stack {
  public readonly ecrRepo: Repository;

  constructor(scope: Construct, context: contextConfig, id: string, props?: StackProps) {
    super(scope, id, props);

    this.ecrRepo = new Repository(this, 'EcrRepo', {
      imageScanOnPush: true,
      repositoryName: context.ecrName
    });

    new CfnOutput(this, 'EcrRepoUri', {
      value: this.ecrRepo.repositoryUri,
      description: 'ECR Repository URI',
      exportName: 'EcrRepoUri'
    });
  }
}
