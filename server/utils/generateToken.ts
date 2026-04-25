import jwt from 'jsonwebtoken'

export const generateTokens = (userId: string, role: string, sellerId?: string) => {
    const accessToken = jwt.sign(
       { id: userId, role, sellerId: sellerId || null},
      process.env.JWT_SECRET as string,
      { expiresIn: '15m'}
    );
const refreshToken = jwt.sign(
    {id: userId },
    process.env.JWT_REFRESH_SECRET as string,
    {expiresIn :'7d'}
);
return {accessToken,refreshToken};
}