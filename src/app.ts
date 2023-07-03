import fastify from "fastify";
import { MealsRoute } from "./routes/meals.route";
import cookie from "@fastify/cookie";
export const app = fastify();
app.register(cookie);
app.register(MealsRoute, {
  prefix: "/meal",
});
