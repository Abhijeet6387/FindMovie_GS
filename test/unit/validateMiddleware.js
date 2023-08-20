import { describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon"; // For mocking the next() function
import validate from "../../middlewares/validate.js";

// Describe block for CheckCred middleware
describe("Middleware::CheckCred", () => {
  // Positive test case: Check if all properties exist and are not empty
  it("should call next() if all properties exist and are not empty", async () => {
    const req = {
      body: {
        prop1: "value1",
        prop2: "value2",
      },
    };
    const res = {};
    const next = sinon.spy();

    const middleware = validate.CheckCred(["prop1", "prop2"]);
    await middleware(req, res, next);

    expect(next.calledOnce).to.be.true;
  });

  // Negative test case: Check if a property is missing
  it("should call next() with an error if a property is missing", async () => {
    const req = {
      body: {
        prop1: "value1",
      },
    };
    const res = {};
    const next = sinon.spy();

    const middleware = validate.CheckCred(["prop1", "prop2"]);
    await middleware(req, res, next);

    expect(next.calledOnce).to.be.true;
    // Verify that the error object passed to next() matches expectations
    expect(next.args[0][0]).to.deep.equal({
      status: 400,
      error: "Property 'prop2' does not exist or is empty in the request body",
    });
  });
});

// Describe block for ValidateUserName middleware
describe("Middleware::ValidateUserName", () => {
  // Positive test case: Check if the username is valid
  it("should call next() if the username is valid", async () => {
    const req = {
      body: {
        username: "valid_username",
      },
    };
    const res = {};
    const next = sinon.spy();

    const middleware = validate.ValidateUserName;
    await middleware(req, res, next);

    expect(next.calledOnce).to.be.true;
  });

  // Negative test case: Check if the username is too short
  it("should call next() with an error if the username is too short", async () => {
    const req = {
      body: {
        username: "ab",
      },
    };
    const res = {};
    const next = sinon.spy();

    const middleware = validate.ValidateUserName;
    await middleware(req, res, next);

    expect(next.calledOnce).to.be.true;
    // Verify that the error object passed to next() matches expectations
    expect(next.args[0][0]).to.deep.equal({
      status: 400,
      error: "Length of username must be between 3 to 32 characters",
    });
  });

  // Negative test case: Check if the username contains invalid characters
  it("should call next() with an error if the username contains invalid characters", async () => {
    const req = {
      body: {
        username: "invalid@username",
      },
    };
    const res = {};
    const next = sinon.spy();

    const middleware = validate.ValidateUserName;
    await middleware(req, res, next);

    expect(next.calledOnce).to.be.true;
    // Verify that the error object passed to next() matches expectations
    expect(next.args[0][0]).to.deep.equal({
      status: 400,
      error:
        "Username can only consist of alphanumeric characters, underscores, and hyphens",
    });
  });
});
