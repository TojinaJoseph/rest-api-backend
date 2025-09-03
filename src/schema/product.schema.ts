import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *        - title
 *        - description
 *        - price
 *        - image
 *       properties:
 *         title:
 *           type: string
 *           default: "Canon EOS 1500D DSLR Camera with 18-55mm Lens"
 *         description:
 *           type: string
 *           default: "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go."
 *         price:
 *           type: number
 *           default: 879.99
 *         image:
 *           type: string
 *           default: "https://i.imgur.com/QlRphfQ.jpg"
 *     productResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         image:
 *           type: string
 *         productId:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         __v:
 *           type: number
 *
 */

export const payload = {
  body: z.object({
    title: z.string(),
    description: z
      .string()
      .min(120, "Description should atleast 120 characters"),
    price: z.number(),
    image: z.string(),
  }),
};

export const params = {
  params: z.object({
    productId: z.string().min(1, "ProductId required"),
  }),
};

export const createProductSchema = z.object({
  ...payload,
});

export const updateProductSchema = z.object({
  ...payload,
  ...params,
});

export const deleteProductSchema = z.object({
  ...params,
});
export const getProductSchema = z.object({
  ...params,
});
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ReadProductInput = z.infer<typeof getProductSchema>;
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;
