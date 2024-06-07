# Example ECS 

This is a demostration project which creates an ECS cluster with EC2 workers, that deploys a simple nginx web app. Utilizing CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Directory Structure ##
```
example_ecs/
├── .gitignore
├── README.md
├── app                   // Sample 'Hello-World' application
    ├── Dockerfile        // Application Dockerfile
    ├── helloworld.conf   // nginx configuration
    └── index.html        // HTML configuration
├── aws-cdk               // Top level directory to contain the CDK configuration
    ├── bin               // Contains the CDK entrypoint
        ├── infra.ts      // Entrypoint
    ├── lib               // Contains CDK library resources
        ├── context.ts    // Contains helper functions to process CDK context
        ├── ecr-stack.ts  // Contains resources for the ECR stack
        ├── ecs-stack.ts  // Contains resources for the ECS stack
        └── vpc-stack.ts  // Contains resources for the VPC stack
    ├── .prettierrc       // Code formatter 'prettier' config file
    ├── cdk.json          // Primary CDK context file
    ├── package.json      // Node.js metadata file
    ├── package-lock.json // Lock file package.json
    └── tsconfig.json     // Typescript config file


```

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
