import { NextApiRequest, NextApiResponse } from "next";

// Универсальная функция для выполнения middleware
export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  middlewares: Function[]
) {
  if (middlewares.length === 0) {
    return Promise.resolve();
  }
  return middlewares.reduce(
    (next, middleware) => () => middleware(req, res, next),
    () => Promise.resolve()
  )();
}
