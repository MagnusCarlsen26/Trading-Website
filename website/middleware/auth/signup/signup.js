import { z } from 'zod'

const usernameSchema = z.string().regex(/^[a-zA-Z0-9]+$/, 'Username must contain only letters and numbers');

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

const emailSchema = z.string().email('Invalid email address');

const schema = z.object({
    username : usernameSchema,
    password : passwordSchema,
    email : emailSchema,
})

export function signupValidation(data) {
    try{
        const userData = schema.safeParse(data)
        return userData
    } catch (error) {
        console.log(error.message)
    }
}

export function signup(data) {
    const result = signupValidation(data)
    if (result.success) {
        return {
            success : true,
            data : {
                message : "Valid credentials"
            }
        }
    } else {
        return {
            success : false,
            data : {
                message : result.error.errors.map(err => ({
                    field: err.path[0],
                    message: err.message,
                }))
            }
        }
    }
}


