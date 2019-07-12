"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies

// The document client affords developers the use of native JavaScript
// types instead of AttributeValues to simplify the JavaScript development
// experience with Amazon DynamoDB.
// - AWS Documentation
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.venueName !== "string" || typeof data.email !== "string") {
    console.error("Validation Failed");
    callback(new Error("Couldn't update owner profile"));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id
    },
    ExpressionAttributeValues: {
      ":venueName": data.venueName,
      ":email": data.email,
      ":photoUri": data.photoUri,
      ":shortDescription": data.shortDescription,
      ":longDescription": data.longDescription,
      ":checked": data.checked,
      ":updatedAt": timestamp
    },
    UpdateExpression:
      "SET venueName = :venueName, email = :email, photoUri = :photoUri, shortDescription = :shortDescription, longDescription = :longDescription, updatedAt = :updatedAt",
    ReturnValues: "ALL_NEW"
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error("Couldn't update the owners profile."));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes)
    };
    callback(null, response);
  });
};
