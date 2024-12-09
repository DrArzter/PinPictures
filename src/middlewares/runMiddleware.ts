import { NextApiRequest, NextApiResponse } from "next";

// Определяем тип для middleware функции
type Middleware = (req: NextApiRequest, res: NextApiResponse, next: (err?: Error | null) => void) => void;

// Универсальная функция для выполнения массива middleware
export async function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  middlewares: Middleware[]
): Promise<void> {
  for (const middleware of middlewares) {
    await new Promise<void>((resolve, reject) => {
      middleware(req, res, (err?: Error | null) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}
