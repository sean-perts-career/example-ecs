import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';
import {
  Cluster,
  AsgCapacityProvider,
  EcsOptimizedImage,
  TaskDefinition,
  Compatibility,
  ContainerImage,
  Ec2Service,
  ListenerConfig,
  AppProtocol
} from 'aws-cdk-lib/aws-ecs';
import { Vpc, InstanceType, InstanceClass, InstanceSize, Port } from 'aws-cdk-lib/aws-ec2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import {
  ApplicationLoadBalancer,
  ApplicationProtocol
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { contextConfig } from '../lib/context';

export interface EcsStackProps extends StackProps {
  vpc: Vpc;
  ecrRepo: Repository;
}

export class EcsStack extends Stack {
  public readonly ecsCluster: Cluster;
  public readonly asg: AutoScalingGroup;
  public readonly ecsService: Ec2Service;
  public readonly alb: ApplicationLoadBalancer;

  constructor(scope: Construct, context: contextConfig, id: string, props: EcsStackProps) {
    super(scope, id, props);

    this.alb = new ApplicationLoadBalancer(this, 'Alb', {
      vpc: props.vpc,
      internetFacing: true
    });

    this.asg = new AutoScalingGroup(this, 'Asg', {
      vpc: props.vpc,
      instanceType: InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.MICRO),
      machineImage: EcsOptimizedImage.amazonLinux(),
      maxCapacity: context.asgMax,
      minCapacity: context.asgMin,
      desiredCapacity: context.asgDesired
    });
    this.asg.connections.allowFrom(this.alb, Port.tcp(80));

    this.ecsCluster = new Cluster(this, 'EcsCluster', {
      clusterName: 'sean-example-ecs',
      enableFargateCapacityProviders: false,
      vpc: props.vpc
    });
    const capacityProvider = new AsgCapacityProvider(this, 'AsgCapacityProvider', {
      autoScalingGroup: this.asg,
      capacityProviderName: 'capacity-provider'
    });
    this.ecsCluster.addAsgCapacityProvider(capacityProvider);

    const ecsExecutionRole = new Role(this, 'ECSTaskExecutionRole', {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
      ]
    });
    const task = new TaskDefinition(this, 'EcsTaskDefinition', {
      compatibility: Compatibility.EC2,
      executionRole: ecsExecutionRole
    });
    const containerDefinition = task.addContainer('EcsTaskContainer', {
      image: ContainerImage.fromRegistry(`${props.ecrRepo.repositoryUri}:${context.imageTag}`),
      memoryLimitMiB: 256,
      containerName: 'sean-nginx'
    });
    containerDefinition.addPortMappings({
      containerPort: 80,
      hostPort: 80,
      appProtocol: AppProtocol.http,
      name: 'http-access'
    });
    this.ecsService = new Ec2Service(this, 'EcsService', {
      cluster: this.ecsCluster,
      taskDefinition: task,
      desiredCount: 2,
      enableExecuteCommand: true
    });

    const listener = this.alb.addListener('AlbListener', {
      port: 80,
      open: true
    });
    this.ecsService.registerLoadBalancerTargets({
      containerName: 'sean-nginx',
      containerPort: 80,
      newTargetGroupId: 'sean-target-group',
      listener: ListenerConfig.applicationListener(listener, {
        protocol: ApplicationProtocol.HTTP
      })
    });

    new CfnOutput(this, 'AlbEndpoint', {
      value: this.alb.loadBalancerDnsName,
      description: 'ALB DNS Endpoint',
      exportName: 'AlbEndpoint'
    });
  }
}
