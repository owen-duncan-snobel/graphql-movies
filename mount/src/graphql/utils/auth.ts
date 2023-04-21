import { GraphQLError } from 'graphql'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const TOKEN_SECRET = process.env.TOKEN_SECRET!
const SALT_ROUNDS = 10

export const generateAccessToken = async (payload: {[key: string]: any}) => {
  try {
    return jwt.sign({ ...payload }, TOKEN_SECRET, {
      expiresIn: '5h'
    })
  } catch (err){
    console.error(err)
    throw new GraphQLError('Unable to generate an access token')
  }
}

export const verifyAccessToken = async (token: string) => {
  if (!token) null
  return jwt.verify(token, TOKEN_SECRET)
}

export const generateHashedPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  return bcrypt.hash(password, salt)
}

export const verifyPassword = async ({ password, hash }: { password: string, hash: string}) => {
  return bcrypt.compare(password, hash)
}