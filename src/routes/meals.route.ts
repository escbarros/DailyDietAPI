import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
export async function MealsRoute(app: FastifyInstance) {
  app.get("/", async (req, res) => {
    return res.status(200).send("teste");
  });

  app.post("/", async (req, res) => {
    const createMealRequisitionSchema = z.object({
      name: z.string(),
      description: z.string(),
      isInDiet: z.boolean(),
    });
    const { name, description, isInDiet } = createMealRequisitionSchema.parse(
      req.body
    );

    let sessionId = req.cookies.sessionId;
    if (!sessionId) {
      sessionId = randomUUID();
      res.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
      });
    }

    await knex("meal").insert({
      name,
      description,
      session_id: sessionId,
      isInDiet,
    });

    return res.status(201);
  });
}
