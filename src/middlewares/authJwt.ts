import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface DecodeToken extends JwtPayload {
  id: string;
  role: string;
}
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        status: 401,
        message: 'Unauthorized',
      });
    }

    const tokenParts = token.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({
        status: 401,
        message: 'Unauthorized',
      });
    }

    const decode = jwt.verify(tokenParts[1], process.env.SECRET_KEY || '') as DecodeToken;

    req.userId = decode.id;
    req.userRole = decode.role;

    next();
  } catch (e) {
    return res.status(401).json({
      status: 401,
      message: 'Unauthorized',
    });
  }
};


const authJwt = {
  verifyToken,
};

export default authJwt;
