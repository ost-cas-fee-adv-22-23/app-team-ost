variable "nextauthUrl" {
  type        = string
  description = "When deploying to production, set the NEXTAUTH_URL environment variable to the canonical URL of your site."
}

variable "nextauthSecret" {
  type        = string
  description = "Used to encrypt the NextAuth.js JWT, and to hash email verification tokens."
}

variable "zitadelIssuer" {
  type        = string
  description = "URL of the ZITADEL Identity Provider."
}

variable "zitadelClientId" {
  type        = string
  description = "Id of the Client as registered at ZITADEL."
}

variable "revalidateSecretToken" {
  type        = string
  description = "Used to check if is a valid request for revalidate some isr page."
}

variable "nextPublicQwackerApiUrl" {
  type        = string
  description = "URL of the Qwacker Api."
}

variable "nextPublicUrl" {
  type        = string
  description = "URL of your site. Used for the `Copy Link` Action in the application."
}

variable "imageTag" {
  type        = string
  description = "Identifier of the docker image which will be deployed."
}

variable "buildVersion" {
  type        = string
  description = "Version of the new release."
}