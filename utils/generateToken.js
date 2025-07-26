import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ adminId: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIREIN
  });
};