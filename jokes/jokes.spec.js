const request = require("supertest");

const server = require("../api/server");

describe("jokes router", () => {
  describe("GET /jokes", () => {
    it("should be 401 without token", async () => {
      const res = await request(server).get("/api/jokes").send({
        username: "marko",
        password: "polo",
      });
      expect(res.status).toBe(401);
    });

    it("has defined status", async () => {
      const res = await request(server).get("/api/jokes").send({
        username: "marko",
        password: "polo",
      });
      expect(res.status).toBeDefined();
    });
  });
});
