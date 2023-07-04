import { FastifyReply, FastifyRequest } from "fastify";

export async function CheckIfRequstHasSessionId(
  req: FastifyRequest,
  res: FastifyReply
) {
  const sessionId = req.cookies.sessionId;
  if (!sessionId)
    return res.status(401).send({ error: "Session Id is not set" });
}
