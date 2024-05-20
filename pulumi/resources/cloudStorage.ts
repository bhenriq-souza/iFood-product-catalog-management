import * as gcp from "@pulumi/gcp"

export function factory(bucketName: string, location: string) {
  return new gcp.storage.Bucket(bucketName, {
      location: location,
  })
}