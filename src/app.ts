import fastify from "fastify";
import { MealsRoute } from "./routes/meals.route";

export const app = fastify();
app.register(MealsRoute, {
  prefix: "/meal",
});
