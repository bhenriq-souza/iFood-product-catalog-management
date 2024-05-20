#!/bin/bash

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
  echo "Usage: $0 <project-name>"
  exit 1
fi

PROJECT_ID=$(gcloud projects list --filter="name=${PROJECT_NAME}" --format="value(projectId)")
if [ -z "$PROJECT_ID" ]; then
  echo "Project '${PROJECT_NAME}' not found."
  exit 1
fi

REQUIRED_APIS=(
  "iam.googleapis.com"
  "cloudresourcemanager.googleapis.com"
  "storage.googleapis.com"
  "cloudfunctions.googleapis.com"
  "compute.googleapis.com"
)

for api in "${REQUIRED_APIS[@]}"; do
  echo "Enabling API: $api"
  gcloud services enable $api --project $PROJECT_ID
done

ROLE_NAME="PulumiRole"
ROLE_TITLE="Pulumi Custom Role for ${PROJECT_NAME}"
ROLE_DESCRIPTION="Custom role for managing resources via Pulumi in ${PROJECT_NAME} project."
SERVICE_ACCOUNT_NAME="${PROJECT_NAME}-sa"
SERVICE_ACCOUNT_DISPLAY_NAME="Pulumi Service Account for ${PROJECT_NAME}"

gcloud iam service-accounts list --filter="email:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" --format="value(email)" | grep "${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" > /dev/null
if [ $? -ne 0 ]; then
  gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
    --display-name "$SERVICE_ACCOUNT_DISPLAY_NAME" \
    --project $PROJECT_ID
fi

GCP_SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

GCP_PERMISSIONS=(
  "storage.buckets.create"
  "storage.buckets.get"
  "compute.regions.list"
)

ROLE_EXISTS=$(gcloud iam roles list --project $PROJECT_ID --format="value(name)" | grep "projects/${PROJECT_ID}/roles/${ROLE_NAME}")

if [ -z "$ROLE_EXISTS" ]; then
  gcloud iam roles create $ROLE_NAME \
    --project $PROJECT_ID \
    --title "$ROLE_TITLE" \
    --description "$ROLE_DESCRIPTION" \
    --permissions "$(IFS=,; echo "${GCP_PERMISSIONS[*]}")" \
    --stage "GA"
else
  gcloud iam roles update $ROLE_NAME \
    --project $PROJECT_ID \
    --permissions "$(IFS=,; echo "${GCP_PERMISSIONS[*]}")" \
    --stage "GA"
fi

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member serviceAccount:$GCP_SERVICE_ACCOUNT_EMAIL \
  --role "projects/${PROJECT_ID}/roles/${ROLE_NAME}"

KEY_FILE_PATH="$HOME/.gcp/${PROJECT_NAME}-key.json"

if [ ! -f "$KEY_FILE_PATH" ]; then
  gcloud iam service-accounts keys create $KEY_FILE_PATH --iam-account=$GCP_SERVICE_ACCOUNT_EMAIL
fi
