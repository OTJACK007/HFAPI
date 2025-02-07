import { Request, Response } from 'express';

export function getMovies(req: Request, res: Response) {
  res.json({
    movies: [
      { id: 1, name: 'How to train your dragon' },
      { id: 2, name: 'Queen of Katwe' },
    ]
  });
}