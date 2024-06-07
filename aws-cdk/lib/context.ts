import { App } from 'aws-cdk-lib';

export interface contextConfig {
  readonly name: string;
  readonly stackIdentifier: string;
  readonly ecrName: string;
  readonly maxAzs: number;
  readonly subnetMask: number;
  readonly asgMin: number;
  readonly asgMax: number;
  readonly asgDesired: number;
  readonly imageTag: string;
}

function validateContext(object: { [name: string]: any }, propName: string): any {
  if (!object[propName]) {
    throw new Error(propName + ' does not exist');
  }

  return object[propName];
}

export function loadConfig(app: App): contextConfig {
  const env = app.node.tryGetContext('config');
  if (!env) {
    throw new Error('Context variable missing on CDK command. Pass in as `-c config=XXX`');
  }

  const unparsedEnv = app.node.tryGetContext(env);

  const cdkConfig: contextConfig = {
    name: env,
    stackIdentifier: validateContext(unparsedEnv, 'stackIdentifier'),
    ecrName: validateContext(unparsedEnv, 'ecrName'),
    maxAzs: validateContext(unparsedEnv, 'maxAzs'),
    subnetMask: validateContext(unparsedEnv, 'subnetMask'),
    asgMin: validateContext(unparsedEnv, 'asgMin'),
    asgMax: validateContext(unparsedEnv, 'asgMax'),
    asgDesired: validateContext(unparsedEnv, 'asgDesired'),
    imageTag: validateContext(unparsedEnv, 'imageTag')
  };

  return cdkConfig;
}
