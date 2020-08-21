const request = require("supertest");

const server = require("../api/server");
const db = require("../database/dbConfig");

describe("test server enpoints for register and login", () => {
  beforeEach(async () => {
    await db("users").truncate();
    await request(server).post("/api/auth/register").send({
      username: "marko",
      password: "polo",
    });
  });

  describe("POST /register", () => {
    it("should post user to /register", async () => {
      await request(server).post("/api/auth/register").send({
        username: "timbo",
        password: "prostofire",
      });

      const users = await db("users");
      expect(users).toHaveLength(2);
    });

    it("/register should return a 200", async () => {
      const res = await request(server).post("/api/auth/register").send({
        username: "kilbosa",
        password: "prostofire",
      });

      expect(res.status).toBe(200);
    });

    it("should return 500 if username is not unique", async () => {
      const res = await request(server).post("/api/auth/register").send({
        username: "marko",
        password: "polo",
      });

      expect(res.status).toBe(500);
    });

    it("should return 2 when successful register", async () => {
      const res = await request(server).post("/api/auth/register").send({
        username: "markopolo",
        password: "prostofire",
      });

      expect(res.body[0]).toBe(2);
    });
  });

  describe("POST /login", () => {
    it("/login should return a 200", async () => {
      const res = await request(server).post("/api/auth/login").send({
        username: "marko",
        password: "polo",
      });

      expect(res.status).toBe(200);
    });

    it("should return 401 with wrong password", async () => {
      const res = await request(server).post("/api/auth/login").send({
        username: "marko",
        password: "polos",
      });

      expect(res.status).toBe(401);
    });

    it("wrong password should return invalid", async () => {
      const res = await request(server).post("/api/auth/login").send({
        username: "marko",
        password: "polos",
      });

      expect(res.body.message).toBe("invalid");
    });

    it("should not return 401 with correct password", async () => {
      const res = await request(server).post("/api/auth/login").send({
        username: "marko",
        password: "polo",
      });

      expect(res.status).not.toBe(401);
    });
  });
});
