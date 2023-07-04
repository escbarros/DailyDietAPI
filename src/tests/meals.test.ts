import { describe, it, beforeAll, beforeEach, afterAll, expect } from "vitest";
import request from "supertest";
import { app } from "../app";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
describe("Meals Routes", () => {
  beforeEach(() => {
    execSync("npm run knex -- migrate:rollback --all");
    execSync("npm run knex -- migrate:latest");
  });
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a new meal", async () => {
    await request(app.server)
      .post("/meal")
      .send({
        id: randomUUID(),
        name: "Refeição de teste",
        description: "Refeição para teste",
        isInDiet: true,
      })
      .expect(201);
  });

  it("should be able to get meals by its user id", async () => {
    const createNewMealRequest = await request(app.server).post("/meal").send({
      id: randomUUID(),
      name: "Refeição de teste",
      description: "Refeição para teste",
      isInDiet: true,
    });

    const cookies = createNewMealRequest.get("Set-Cookie");

    const getMealBySessionId = await request(app.server)
      .get("/meal")
      .set("Cookie", cookies);

    expect(getMealBySessionId.body.meals).toEqual([
      expect.objectContaining({
        name: "Refeição de teste",
        description: "Refeição para teste",
        isInDiet: 1,
      }),
    ]);
  });

  it("should be able to get a meal by its id", async () => {
    const createNewMealRequest = await request(app.server).post("/meal").send({
      id: randomUUID(),
      name: "Refeição de teste",
      description: "Refeição para teste",
      isInDiet: true,
    });

    const cookies = createNewMealRequest.get("Set-Cookie");
    await request(app.server)
      .post("/meal")
      .send({
        id: randomUUID(),
        name: "Refeição de teste dois",
        description: "Refeição para teste dois",
        isInDiet: true,
      })
      .set("Cookie", cookies);

    const getMealBySessionId = await request(app.server)
      .get("/meal")
      .set("Cookie", cookies);

    const { id } = getMealBySessionId.body.meals[0];

    const getMealByItsId = await request(app.server)
      .get(`/meal/${id}`)
      .set("Cookie", cookies);

    expect(getMealByItsId.body.meal).toEqual(
      expect.objectContaining({
        name: "Refeição de teste",
        description: "Refeição para teste",
        isInDiet: 1,
      })
    );
  });
});
