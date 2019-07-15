"use strict";

const mochaPlugin = require("serverless-mocha-plugin");
const expect = mochaPlugin.chai.expect;

// const wrappedList = mochaPlugin.getWrapper(
//   "listUsers",
//   "/handlers/users.js",
//   "list"
// );
const wrappedGet = mochaPlugin.getWrapper("get", "/owners/get.js", "get");
const wrappedAdd = mochaPlugin.getWrapper(
  "create",
  "/owners/create.js",
  "create"
);
const wrappedUpdate = mochaPlugin.getWrapper(
  "update",
  "/owners/update.js",
  "update"
);
const wrappedRemove = mochaPlugin.getWrapper(
  "delete",
  "/owners/delete.js",
  "delete"
);

describe("Owners", () => {
  //   it("listUsers should return an empty list by default", () => {
  //     return wrappedList.run({}).then(response => {
  //       expect(response).to.not.be.empty;
  //       expect(response.statusCode).to.equal(200);

  //       const list = JSON.parse(response.body);
  //       expect(list).to.be.an.instanceOf(Array);
  //       expect(list).to.deep.equal([]);
  //     });
  //   });

  it("owners/get should return 404 if not found", () => {
    return wrappedGet
      .run({ pathParameters: { id: "00000f1afa7663142200d252" } })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(404);
        expect(response.body).to.equal("Owner profile does not exist.");
      });
  });

  it("owners/update should return 404 if not found", () => {
    return wrappedUpdate
      .run({ pathParameters: { id: "00000f1afa7663142200d252" } })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(404);
        expect(response.body).to.equal(
          "Owner profile does not exist to update."
        );
      });
  });

  it("owners/delete should return 404 if not found", () => {
    return wrappedRemove
      .run({ pathParameters: { id: "00000f1afa7663142200d252" } })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(404);
        expect(response.body).to.equal(
          "Owner profile does not exist to remove"
        );
      });
  });

  it("owners/create should accept and store a new user", () => {
    const payload = {
      phoneNumber: "23456789",
      place_id: "sdfghj",
      venueName: "Test Venue",
      address: "Test Address",
      photoUri: "test.com",
      email: "test@testVenue.com",
      longDescription: "a test example for long description",
      data_type: "profile",
      shortDescription: "test description",
      longitude: "3456",
      latitude: "8697"
    };
    return wrappedAdd
      .run({ body: JSON.stringify(payload) })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.body).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const result = JSON.parse(response.body);
        expect(result.id).to.have.length.gt(0);

        return wrappedGet.run({ pathParameters: { id: result.id } });
      })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const remoteUser = JSON.parse(response.body);
        expect(remoteUser).to.be.an.instanceOf(Object);
        expect(remoteUser.id).to.have.length.gt(0);
        expect(remoteUser.phoneNumber).to.equal(payload.phoneNumber);
        expect(remoteUser.place_id).to.equal(payload.place_id);
        expect(remoteUser.venueName).to.equal(payload.venueName);
        expect(remoteUser.address).to.equal(payload.address);
        expect(remoteUser.photoUri).to.equal(payload.photoUri);
        expect(remoteUser.email).to.equal(payload.email);
        expect(remoteUser.longDescription).to.equal(payload.longDescription);
        expect(remoteUser.data_type).to.equal(payload.data_type);
        expect(remoteUser.shortDescription).to.equal(payload.shortDescription);
        expect(remoteUser.longitude).to.equal(payload.longitude);
        expect(remoteUser.latitude).to.equal(payload.latitude);

        return wrappedList.run({});
      })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const list = JSON.parse(response.body);
        expect(list).to.be.an.instanceOf(Array);
        expect(list).to.have.lengthOf(1);
      });
  });

  it("updateUser should update existing users", () => {
    const payload = {
      name: "Jane",
      lastName: "Smithee",
      email: "user2@email.com"
    };
    let userId;
    return wrappedList
      .run({})
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const list = JSON.parse(response.body);
        expect(list).to.be.an.instanceOf(Array);
        expect(list).to.have.lengthOf(1);
        expect(list[0]).to.not.be.empty;
        expect(list[0]._id).to.not.be.empty;

        userId = list[0]._id;

        return wrappedUpdate.run({
          pathParameters: { id: userId },
          body: JSON.stringify(payload)
        });
      })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.body).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const result = JSON.parse(response.body);
        expect(result._id).to.have.length.gt(0);

        return wrappedGet.run({ pathParameters: { id: result._id } });
      })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const remoteUser = JSON.parse(response.body);
        expect(remoteUser).to.be.an.instanceOf(Object);
        expect(remoteUser._id).to.have.length.gt(0);
        expect(remoteUser.name).to.equal(payload.name);
        expect(remoteUser.lastName).to.equal(payload.lastName);
        expect(remoteUser.email).to.equal(payload.email);
      });
  });

  it("removeUser should remove existing users", () => {
    let userId;
    return wrappedList
      .run({})
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const list = JSON.parse(response.body);
        expect(list).to.be.an.instanceOf(Array);
        expect(list).to.have.lengthOf(1);
        expect(list[0]).to.not.be.empty;
        expect(list[0]._id).to.not.be.empty;

        userId = list[0]._id;

        return wrappedRemove.run({ pathParameters: { id: userId } });
      })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.body).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const result = JSON.parse(response.body);
        expect(result._id).to.have.length.gt(0);

        return wrappedList.run({});
      })
      .then(response => {
        expect(response).to.not.be.empty;
        expect(response.statusCode).to.equal(200);

        const list = JSON.parse(response.body);
        expect(list).to.be.an.instanceOf(Array);
        expect(list).to.deep.equal([]);
      });
  });
});
