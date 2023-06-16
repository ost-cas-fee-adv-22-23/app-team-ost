locals {
  name       = "app-team-ost"
  gcp_region = "europe-west6"
  image_tag  = var.imageTag
  environment_vars = {
    NEXTAUTH_URL                = var.nextauthUrl,
    NEXTAUTH_SECRET             = var.nextauthSecret,
    ZITADEL_ISSUER              = var.zitadelIssuer,
    ZITADEL_CLIENT_ID           = var.zitadelClientId,
    REVALIDATE_SECRET_TOKEN     = var.revalidateSecretToken,
    NEXT_PUBLIC_QWACKER_API_URL = var.nextPublicQwackerApiUrl,
    NEXT_PUBLIC_URL             = var.nextPublicUrl
  }
}

provider "google" {
  project = "app-team-ost"
  region  = local.gcp_region
}

data "google_project" "project" {
}

terraform {
  backend "gcs" {
    bucket = "app-team-ost-tf-state"
  }
}
