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

  it("should be able to update a meal", async () => {
    const createNewMealRequest = await request(app.server).post("/meal").send({
      id: randomUUID(),
      name: "Refeição de teste",
      description: "Refeição para teste",
      isInDiet: true,
    });

    const cookies = createNewMealRequest.get("Set-Cookie");
    const getMealsBySessionId = await request(app.server)
      .get("/meal")
      .set("Cookie", cookies);

    const { id } = getMealsBySessionId.body.meals[0];
    await request(app.server)
      .put(`/meal/${id}`)
      .set("Cookie", cookies)
      .send({
        name: "Nova refeição",
        description: "Nova descrição",
        isInDiet: false,
      })
      .expect(200);
  });
  it("should be able to delete a meal", async () => {
    const createNewMealRequest = await request(app.server).post("/meal").send({
      id: randomUUID(),
      name: "Refeição de teste",
      description: "Refeição para teste",
      isInDiet: true,
    });

    const cookies = createNewMealRequest.get("Set-Cookie");
    const getMealsBySessionId = await request(app.server)
      .get("/meal")
      .set("Cookie", cookies);

    const { id } = getMealsBySessionId.body.meals[0];

    await request(app.server)
      .delete(`/meal/${id}`)
      .set("Cookie", cookies)
      .expect(204);
  });
  it("should be able to get user metrics", async () => {
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
        isInDiet: false,
      })
      .set("Cookie", cookies);

    const getUserMetrics = await request(app.server)
      .get("/meal/metrics")
      .set("Cookie", cookies);
    expect(getUserMetrics.body).toEqual(
      expect.objectContaining({
        amount: 2,
        inDiet: 1,
        outDiet: 1,
        bestDietSequence: 1,
      })
    );
  });
});
