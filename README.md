# Example ECS #

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
## Prerequisites ##
* Configure Node.js environment
  * Setup and configure node version manager: https://github.com/nvm-sh/nvm
  * Run `nvm install 22` and `nvm use 22` to install and set Node v22
  * Install NPM dependencies
    * Navigate to `example-ecs/aws-cdk`
    * Run `npm install`
* Configure AWS Environment 
  * Install the AWS CLI
    * Follow these instructions: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
  * Configure AWS credentials
    * See: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html#cli-configure-files-format
    * Make sure to set up a profile to more easily access AWS, as the rest of this tutorial will assume a profile has been created
  * Confirm your credentials have sufficient permissions to perform the deployment 
* Configure Docker environment
  * Follow: https://docs.docker.com/engine/install/

## Deployment Procedure ##
1. Setup & connect to the ECR repository \
  a. Run `npx cdk --profile <YOUR_PROFILE> -c config=dev deploy test-dev-ecrStack` \
  b. Retrieve the stack output as shown: `test-dev-ecrStack.EcrRepoUri = <AWS_ACCOUNT_NUMBER>.dkr.ecr.<AWS_REGION>.amazonaws.com/sean-example-ecs` \
  c. Consult the AWS ECR login procedure here: https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html
  d. Using the endpoint provided by the stack output, login to the newly created ECR repository
2. Build & Push the Docker image \
  a. Navigate to `app` directory \
  b. Run `docker build -f Dockerfile -t <ECR_REPO>:latest .` substituting in the appropriate ECR URI \
  c. Run `docker push <ECR_REPO>:latest` substituting in the appropriate ECR URI
3. Complete the CDK deployment \
  a. Navigate to the `aws-cdk` directory \
  b. Run `npx cdk --profile <YOUR_PROFILE> -c config=dev deploy --all` \
  c. Once the deployment is underway type `y` to accept the changes for each of the two following stacks, at the end there will be an output for the ALB DNS Endpoint \
  d. Copy and paste the ALB DNS Endpoint into a browser and the nginx server display should appear

## Cleanup Procedure ##
1. Remove scale-in protection for EC2 instances apart of the ASG \
  a. Navigate to Auto Scaling Group in the AWS Console, find the ASG created from this CDK stack \
  b. Navigate to instance management and select all instances \
  c. Then click `Actions` => `Remove scale-in protection`
2. Teardown the CDK stacks \
  a. In the AWS console, navigate to the Auto Scaling Groups. 
  b. Run `npx cdk --profile <YOUR_PROFILE> -c config=dev deploy --all` \
3. Delete ECR Repository \
  a. In the AWS console, navigate to ECR \
  b. Delete the CDK created ECR repository 

## Useful commands
* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
