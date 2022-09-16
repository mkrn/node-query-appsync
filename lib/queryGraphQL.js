const env = require('process').env;
const fetch = require('node-fetch');
const URL = require('url');
const AWS = require('aws-sdk');


// Authenticate as lambda
AWS.config.update({
    region: env.AWS_REGION,
    credentials: new AWS.Credentials(env.AWS_ACCESS_KEY_ID, env.AWS_SECRET_ACCESS_KEY, env.AWS_SESSION_TOKEN)
});

const uri = URL.parse(env.GRAPHQL_API);

module.exports = async (post_body) => {
  try {
    // console.log(`Posting = ${JSON.stringify(post_body, null, 2)}`)
    const httpRequest = new AWS.HttpRequest(uri.href, env.AWS_REGION);
    httpRequest.headers.host = uri.host;
    httpRequest.headers['Content-Type'] = 'application/json';
    httpRequest.method = 'POST';
    httpRequest.body = JSON.stringify(post_body);

    const creds = await AWS.config.credentials.getPromise();
    const signer = new AWS.Signers.V4(httpRequest, "appsync", true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

    const options = {
      method: httpRequest.method,
      body: httpRequest.body,
      headers: httpRequest.headers
    };

    const res = await fetch(uri.href, options);
    const json = await res.json();
    console.log(`JSON Response = ${JSON.stringify(json, null, 2)}`);

    return json;
  } catch (err) {
    console.error(`FETCH ERROR: ${JSON.stringify(err, null, 2)}`);
    throw err;
  }
}

