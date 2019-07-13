"use strict";

const endpoints = require("./endpoints.json");

module.exports.endpoints = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: endpoints
    })
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
