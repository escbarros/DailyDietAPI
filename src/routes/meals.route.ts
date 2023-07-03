import { FastifyInstance } from "fastify";
export async function MealsRoute(app: FastifyInstance) {
  app.get("/", (req, res) => {
    return res.status(200).send("teste");
  });
}
