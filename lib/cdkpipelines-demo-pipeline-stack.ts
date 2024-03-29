import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CodePipeline, CodePipelineSource, ShellStep, CodeBuildStep } from "@aws-cdk/pipelines";
import { CdkpipelinesDemoStage } from './cdkpipelines-demo-stage';
import * as iam from '@aws-cdk/aws-iam';
/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'MyServicePipeline',
      dockerEnabledForSynth: true,
       // How it will be built and synthesized
       synth: new ShellStep('Synth', {
         // Where the source can be found
         input: CodePipelineSource.gitHub('ruchirshetye/cdkpipelines-demo', 'main'),

         // Install dependencies, build and run cdk synth
         commands: [
           'npm ci',
           'npm run build',
           'npx cdk synth'
         ],
       }),
    });

    //This CodeBuild Stage which will remove all the "assets." Folder from the [Synth_Output] Artifact and keep only the templates required by Cloudformation Stage.
    //pipeline.addWave('trimArtifact', {
    //  post: [
    //    new CodeBuildStep('trimArtifact', {
    //      commands: [
     //               "LATEST=$(aws s3 ls s3://cdkpipelinesdemopipeline-pipelineartifactsbucketa-yquvd012ukcm/MyServicePipeline/Synth_Outp/ | sort | tail -n 1 | awk '{print $4}')",
     //               "aws s3 cp s3://cdkpipelinesdemopipeline-pipelineartifactsbucketa-yquvd012ukcm/MyServicePipeline/Synth_Outp/$LATEST .",
     //               "unzip $LATEST -d tmp",
     //               "cd tmp",
     //               "rm -rf asset.*",  //Removes all the assets. You can use mv command as well
     //               "zip -r -A $LATEST *",
     //               "aws s3 cp $LATEST s3://cdkpipelinesdemopipeline-pipelineartifactsbucketa-yquvd012ukcm/MyServicePipeline/Synth_Outp/$LATEST"
     //             ],

     //   rolePolicyStatements: [
     //     new iam.PolicyStatement({
     //               actions: ['s3:*'],
     //               resources: ['*']
     //           })
     //       ],
     //   }),

      //  new CodeBuildStep('trimArtifact2', {
       //   commands: [
       //             "LATEST=$(aws s3 ls s3://cdkpipelinesdemopipeline-pipelineartifactsbucketa-yquvd012ukcm/MyServicePipeline/Synth_Outp/ | sort | tail -n 1 | awk '{print $4}')",
       //             "aws s3 cp s3://cdkpipelinesdemopipeline-pipelineartifactsbucketa-yquvd012ukcm/MyServicePipeline/Synth_Outp/$LATEST .",
       //             "unzip $LATEST -d tmp",
      //              "cd tmp",
      //              "rm -rf asset.*",  //Removes all the assets. You can use mv command as well
      //              "zip -r -A $LATEST *",
      //              "aws s3 cp $LATEST s3://cdkpipelinesdemopipeline-pipelineartifactsbucketa-yquvd012ukcm/MyServicePipeline/Synth_Outp/$LATEST"
      //            ],

    //    rolePolicyStatements: [
    //      new iam.PolicyStatement({
   //                 actions: ['s3:*'],
   //                 resources: ['*']
   //             })
   //         ],
  //      }),
  //    ],
  //  });


    pipeline.addStage(new CdkpipelinesDemoStage(this, 'PreProd'
    //,
    // {
//  env: { account: '997785413584', region: 'us-east-1' }
  // }
 )
 );
  }
}
