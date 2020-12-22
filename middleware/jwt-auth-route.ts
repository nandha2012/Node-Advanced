import * as jwtToken from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { statusCode } from '../config'

export class JwtAuthRoute {
    public async checkAuthReq(req: Request, res: Response, next: NextFunction) {

        try {
            const bearerHeader = req.headers["authorization"]
            //console.log('req :'+bearerHeader);

            const token = bearerHeader.split(' ')[1];

            let decoded = await jwtToken.decode(token.toString());
            if (decoded) {
                console.log(decoded);
                next();
            }
            else {
                res.status(statusCode.badRequest).json({ message: "Token failed..!" });
            }

        } catch (err) {
            res.status(statusCode.internalServerError).json({ message: "Internal server Error" });
        }

    }
}