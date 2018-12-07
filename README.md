# node-query-appsync

Library to query AppSync GraphQL API from Node.js process such as Lambda

## Usage

```
npm i node-query-appsync --save
```

```
const queryGraphQL = require('node-query-appsync');

exports.handler = async (event, context, callback) => {

  // ...

  const eventsQuery = {
    operationName: 'ListEvents',
    query:
      `query ListEvents($venue: String!) {
        broadcaster_by_key(venue: $venue) {
          title
          date
          owner {
            first_name
            last_name
          }
        }
      }`
    ,
    variables: {
      venue,
    }
  };

  const { data } = await queryGraphQL(eventsQuery);

  // ...
};

```

## Advantages of using AppSync from Backend

Mutations that are called by lambdas, invoked by triggers, webhooks and other events can then invoke subscriptions giving you nice real-time capabilities on front-end, while maintaining uniform global schema.

## Environment prerequisites

The following environment variables are used. They are pre-set by default in Lambda environment.

- AWS_REGION
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_SESSION_TOKEN

## Configuring Lambda permissions to AppSync

1) Use AWS_IAM authentication type with your GraphQL API.
CloudFormation example (YAML):

```
  GraphQLApi:
    Type: "AWS::AppSync::GraphQLApi"
    Properties:
      Name: ExampleApi
      AuthenticationType: "AWS_IAM"
```

2) Add permissions to Lambda to appsync:GraphQL Action.
CloudFormation example (YAML):

```
  Role:
    Type: "AWS::IAM::Role"
    Properties:
      RoleName: example-lambda-role
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          -
            Effect: "Allow"
            Principal:
              Service:
                - "lambda.amazonaws.com"
            Action:
              - "sts:AssumeRole"
      Path: "/"
      Policies:
        - PolicyName: Logs
          PolicyDocument:
            Version: 2012-10-17
            Statement:
              -
                Effect: Allow
                Action:
                  - "logs:CreateLogGroup"
                  - "logs:CreateLogStream"
                  - "logs:PutLogEvents"
                Resource: "arn:aws:logs:*:*:*"
              -
                Effect: Allow
                Action: appsync:GraphQL
                Resource:
                  # Specify limited queries and mutations here:
                  - !Sub "${GraphQLApi}/types/Query/*"
                  - !Sub "${GraphQLApi}/types/Mutation/*"
```

## Limitations

Use with Node 8+

## Thanks

Adrian Hall @AwsforMobile
Code is extracted from this article https://read.acloud.guru/backend-graphql-how-to-trigger-an-aws-appsync-mutation-from-aws-lambda-eda13ebc96c3.

## License
MIT