#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { loadConfig } from '../lib/context';
import { EcrStack } from '../lib/ecr-stack';
import { VpcStack } from '../lib/vpc-stack';
import { EcsStack } from '../lib/ecs-stack';

const app = new App();
const context = loadConfig(app);
const identifier = `${context.stackIdentifier}-${context.name}`;

const ecrStack = new EcrStack(app, context, `${identifier}-ecrStack`, {});

const vpcStack = new VpcStack(app, context, `${identifier}-vpcStack`, {});

const ecsStack = new EcsStack(app, context, `${identifier}-ecsStack`, {
  vpc: vpcStack.vpc,
  ecrRepo: ecrStack.ecrRepo
});
ecsStack.addDependency(ecrStack);
ecsStack.addDependency(vpcStack);
