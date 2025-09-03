import { z } from "zod";
console.log("inside schema");

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        name:
 *          type: string
 *          default: Jane Doe
 *        password:
 *          type: string
 *          default: stringPassword123
 *        passwordConfirmation:
 *          type: string
 *          default: stringPassword123
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        name:
 *          type: string
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */

export const createUserSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, "Name is required"),
      password: z.string().min(6, "password too short"),
      passwordConfirmation: z
        .string()
        .min(1, "password confirmation is required"),
      email: z.string().email("Invalid email"),
    })

    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Password do not match",
      path: ["passwordConfirmation"],
    }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
