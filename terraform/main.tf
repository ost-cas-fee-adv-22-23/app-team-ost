locals {
  name       = "app-team-ost"
  gcp_region = "europe-west6"
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
