import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { CheckIfRequstHasSessionId } from "../middlewares/check-if-request-has-session-id";

export async function MealsRoute(app: FastifyInstance) {
  app.get(
    "/",
    { preHandler: [CheckIfRequstHasSessionId] },
    async (req, res) => {
      const sessionId = req.cookies.sessionId;
      const meals = await knex("meal").select().where("session_id", sessionId);
      return res.status(200).send({ meals });
    }
  );

  app.get(
    "/:id",
    { preHandler: [CheckIfRequstHasSessionId] },
    async (req, res) => {
      const getMealByIdParamSchema = z.object({
        id: z.string().uuid(),
      });
      const { id } = getMealByIdParamSchema.parse(req.params);
      const { sessionId } = req.cookies;
      const meal = await knex("meal")
        .where({ id, session_id: sessionId })
        .select();

      return res.status(200).send({ meal: meal[0] });
    }
  );

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
      id: randomUUID(),
      name,
      description,
      session_id: sessionId,
      isInDiet,
    });

    return res.status(201).send();
  });
}
