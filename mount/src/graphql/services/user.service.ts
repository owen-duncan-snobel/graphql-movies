import { GraphQLError } from "graphql"
import prisma from "../../libs/prisma/client"
import bcrypt from 'bcryptjs'
import { generateHashedPassword, verifyAccessToken, verifyPassword } from "../utils/auth"
import { JwtPayload } from "jsonwebtoken"

export const getUserWithToken = async (token: string) => {
  try {
    const payload = await verifyAccessToken(token) as JwtPayload
    if (!payload) return null
    const user = await prisma.user.findFirst({
      where: {
        id: payload.id
      },
      select: {
        id: true,
        username: true,
        email: true
      }
    })
    return user
  } catch (err: any){
    return null
  }
}

export const createUser = async ({ username, password, email }: {username: string, password: string, email: string}) => {
  try {
    const hash = await generateHashedPassword(password)
    return await prisma.user.create({
      data: {
        username,
        password: hash,
        email
      }
    })
  } catch (err: any){
    // console.error(err) // TODO: Replace with a logger service
    if (err.code === 'P2002') {
      throw new GraphQLError('Username or email already exists', {
        extensions: {
          code: 'BAD_USER_INPUT'
        }
      })
    }
  }
}

export const verifyUser = async ({email, password}: {email: string, password: string}) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })
    if (!user) throw new GraphQLError('User not found')
    const isMatch = await verifyPassword({ password, hash: user.password })
    if (!isMatch) throw new GraphQLError('Invalid credentials')
    return user
  } catch (err: any){
    if (err.code === 'P2025') {
      throw new GraphQLError('User not found', {
        extensions: {
          code: 'BAD_USER_INPUT'
        }
      })
    }
    throw new GraphQLError('Unable to login user. ensure that you have the correct credentials', {
      extensions: {
        http: { status: 401 }
      }
    })
  }
}

export const updatePassword = async ({id, old_password, new_password}: {id: number, old_password: string, new_password: string}) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: id
      }
    })
    if (!user) throw new GraphQLError('User not found')

    const isMatch = await verifyPassword({ password: old_password, hash: user.password })
    if (!isMatch) throw new GraphQLError('Invalid credentials')

    const hash = await generateHashedPassword(new_password)
    return await prisma.user.update({
      where: {
        id: id
      },
      data: {
        password: hash
      }
    })
  } catch(err: any) {
    throw new GraphQLError('Unable to update password')
  }
}