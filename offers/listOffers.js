"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies

// The document client affords developers the use of native JavaScript
// types instead of AttributeValues to simplify the JavaScript development
// experience with Amazon DynamoDB.
// - AWS Documentation
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: process.env.DYNAMODB_TABLE,
  ProjectionExpression:
    "#dt, id, price, drink, quantity, coupon_id, active, createdAt, updatedAt",
  FilterExpression: "#dt = :offer",
  ExpressionAttributeNames: {
    "#dt": "data_type"
  },
  ExpressionAttributeValues: {
    ":offer": "offer"
  }
};

module.exports.listOffers = (event, context, callback) => {
  // fetch all pets from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error("Couldn‘t fetch the offers."));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    };
    callback(null, response);
  });
};
