import mongoose from "mongoose";
import * as UserService from "../service/user.service";
import * as SessionService from "../service/session.service";
import supertest from "supertest";
import createServer from "../utils/server";
import { createSessionHandler } from "../controller/session.controller";

const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
  _id: userId,
  email: "jane.doe@example.com",
  name: "Jane Doe",
};
const userInput = {
  email: "test@example.com",
  name: "Jane Doe",
  password: "Password123",
  passwordConfirmation: "Password123",
};
const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: "PostmanRuntime/7.28.4",
  createdAt: new Date("2021-09-30T13:31:07.674Z"),
  updatedAt: new Date("2021-09-30T13:31:07.674Z"),
  __v: 0,
};

const app = createServer();
describe("user", () => {
  //user registration
  describe("user registration", () => {
    describe("give tne username and password are valid", () => {
      it("should return the user payload", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode, body } = await supertest(app)
          .post("/api/users")
          .send(userInput);

        expect(statusCode).toBe(200);
        expect(body).toEqual(userPayload);

        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });
    describe("give tne passswords do not match", () => {
      it("should return a 404", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode, body } = await supertest(app)
          .post("/api/users")
          .send({ ...userInput, passwordConfirmation: "doesnotmatch" });

        expect(statusCode).toBe(400);

        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });

    describe("give the user service throws", () => {
      it("should return a 409", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockRejectedValue("Oh no ...");

        const { statusCode, body } = await supertest(app)
          .post("/api/users")
          .send(userInput);

        expect(statusCode).toBe(409);

        expect(createUserServiceMock).toHaveBeenCalled();
      });
    });
  });

  describe("create user session", () => {
    describe("given the username and password are valid", () => {
      it("should return a signed accessToken and refreshToken", async () => {
        jest
          .spyOn(UserService, "validatePassword")
          //@ts-ignore
          .mockReturnValue(userPayload);

        jest
          .spyOn(SessionService, "createSession")
          //@ts-ignore
          .mockReturnValue(sessionPayload);

        const req = {
          get: () => {
            return "a user agent";
          },
          body: {
            email: "test@example.com",
            password: "Password123",
          },
        };

        const send = jest.fn();
        const res = {
          send,
        };
        //@ts-ignore
        await createSessionHandler(req, res);

        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
    });
  });
  //validation of username and password
  //verify that passwords must match
  //verify that the handler handles any error
  //creating a user session
  //a user can login with a valid email and password
});
