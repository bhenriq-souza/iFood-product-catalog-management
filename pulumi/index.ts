import { configDotenv } from 'dotenv';
import * as pulumi from "@pulumi/pulumi";
import * as storage from "./resources/cloudStorage";

configDotenv({
  path: ['../.env.local', '../.env'],
  debug: Boolean(process.env.DEBUG),
});

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS is required.");
}

process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const config = new pulumi.Config();
const region = process.env.GCP_REGION || config.require("gcp:region");

const sourceCodeBucket = storage.factory(`functions-source-code-${process.env.GCP_PROJECT_NAME}`, region);

export const sourceCodeBucketName = sourceCodeBucket.name;
