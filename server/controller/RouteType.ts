import { Request, Response, NextFunction } from 'express';

export type RouteType = (
    req: Request,
    res: Response,
    next: NextFunction,
 ) => void