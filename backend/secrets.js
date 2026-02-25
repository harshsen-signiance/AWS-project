const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const client = new SecretsManagerClient({ region: "us-east-1" });

async function getSecret(secretName) {
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secretName,
    })
  );

  return response.SecretString;
}

module.exports = { getSecret };