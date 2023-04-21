import { GraphQLError } from "graphql"
import { generateAccessToken, verifyPassword } from "../utils/auth"
import { createUser, updatePassword, verifyUser } from "../services/user.service"
import { z } from "zod"

const RegisterSchema = z.object({
  username: z.string().min(3).max(255),
  password: z.string().min(5).max(255),
  email: z.string().email()
},)

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(255)
})

const UpdatePasswordSchema = z.object({
  id: z.coerce.number(),
  old_password: z.string().min(5).max(255),
  new_password: z.string().min(5).max(255)
})

interface Context {
  user: {
    id: string
    email: string
    username: string 
  } | null
}

export const userResolver = {
  Query: {},
  Mutation: {
    register: async (_: any, {username, password, email}: Record<string, string>) => {
      const validateInputs = RegisterSchema.safeParse({username, password, email})
      if (!validateInputs.success) throw new GraphQLError('Invalid inputs')

      const user = await createUser({ username, password, email })
      if (!user) throw new GraphQLError(`Unable to register user with email: ${email}`)

      const token: string = await generateAccessToken({
        id: user.id,
        username: user.username,
        email: user.email
      })
      return { token }
    },
    login: async (_: any, {email, password}: Record<string, string>) => {
      const validateInputs = await LoginSchema.safeParse({ email, password })
      if (!validateInputs.success) throw new GraphQLError('Invalid email or password')

      const user = await verifyUser({ email, password })
      if (!user) throw new GraphQLError(`Unable to login user with email: ${email}`)

      const token: string = await generateAccessToken({
        id: user.id,
        username: user.username,
        email: user.email
      })
      return { token }
    },
    updatePassword: async (_: any, { old_password, new_password }: Record<string, string>, context: Context) => {
      if (!context || !context.user) throw new GraphQLError('Unauthorized access, please login')
      const { id } = context.user
      const validateInputs = await UpdatePasswordSchema.safeParse({ id, old_password, new_password })
      if (!validateInputs.success) throw new GraphQLError('Invalid inputs')
      const user = await updatePassword({ id: +id, old_password, new_password })
      if (!user) throw new GraphQLError('Unable to update password for user')
      return 'Password updated successfully'
    }
  }
}
export default userResolver