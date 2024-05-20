import * as pulumi from "@pulumi/pulumi"
import * as gcp from "@pulumi/gcp"

interface CloudFunctionArgs {
  bucket: gcp.storage.Bucket;
  entryPoint: string;
  name: string;
  region: string;
  memory?: number;
  runtime?: string;
  envVars?: pulumi.Input<{ [key: string]: pulumi.Input<string> }>
  isHttpTrigger?: boolean;
}

export function createCloudFunction(args: CloudFunctionArgs): gcp.cloudfunctions.Function {
    const runtime = args.runtime || "nodejs20"
    const memory = args.memory || 128

    return new gcp.cloudfunctions.Function(args.name, {
        runtime: runtime,
        entryPoint: args.entryPoint,
        sourceArchiveBucket: args.bucket.name,
        sourceArchiveObject: pulumi.interpolate`${args.name}.zip`,
        triggerHttp: args.isHttpTrigger || true,
        availableMemoryMb: memory,
        region: args.region,
        environmentVariables: args.envVars,
    });
}
