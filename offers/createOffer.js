"use strict";

//const uuid = require("uuid");
const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies

// The document client affords developers the use of native JavaScript
// types instead of AttributeValues to simplify the JavaScript development
// experience with Amazon DynamoDB.
// - AWS Documentation
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createOffer = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.data_type !== "string" || typeof data.type !== "string") {
    console.error("Validation Failed");
    callback(new Error("Couldn't create a new deal."));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: data.id,
      venueName: data.venueName,
      data_type: data.data_type,
      duration: data.duration,
      price: data.price,
      drink: data.drink,
      quantity: data.quantity,
      type: data.type,
      coupon_id: data.coupon_id,
      active: data.active,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };

  // write the pet to the database
  dynamoDb.put(params, error => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error("Couldn't post the deal"));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    };
    callback(null, response);
  });
};
