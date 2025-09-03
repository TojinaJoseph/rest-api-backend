import { Express, Request, Response } from "express";
import {
  createUserhandler,
  getCurrentUser,
} from "./controller/user.controller";
import validate from "./middleware/validate Resource";
import { createUserSchema } from "./schema/user.schema";
import {
  createSessionHandler,
  deleteSessionHandler,
  getUserSessionHandler,
  googleOauthHandler,
  logoutHandler,
} from "./controller/session.controller";
import { createSessionSchema } from "./schema/session.shema";
import { requireUser } from "./middleware/requireUser";
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from "./schema/product.schema";
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  updateProductHandler,
} from "./controller/product.controller";
function routes(app: Express) {
  /**
   * @openapi
   * '/healthcheck':
   *   get:
   *     tags:
   *      - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *      200:
   *         description: App is up and running
   */

  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });
  /**
   * @openapi
   * /api/users:
   *  post:
   *    tags:
   *     - User
   *    summary: Register a user
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInput'
   *    responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.post("/api/users", validate(createUserSchema), createUserhandler);
  app.get("/api/me", requireUser, getCurrentUser);

  /**
   * @openapi
   * '/api/sessions':
   *  get:
   *    tags:
   *    - Session
   *    summary: Get all sessions
   *    responses:
   *      200:
   *        description: Get all sessions for current user
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/GetSessionResponse'
   *      403:
   *        description: Forbidden
   *  post:
   *    tags:
   *    - Session
   *    summary: Create a session
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateSessionInput'
   *    responses:
   *      200:
   *        description: Session created
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateSessionResponse'
   *      401:
   *        description: Unauthorized
   *  delete:
   *    tags:
   *    - Session
   *    summary: Delete a session
   *    responses:
   *      200:
   *        description: Session deleted
   *      403:
   *        description: Forbidden
   */

  app.post(
    "/api/sessions",
    validate(createSessionSchema),
    createSessionHandler
  );

  app.get("/api/sessions", requireUser, getUserSessionHandler);
  app.delete("/api/sessions", requireUser, deleteSessionHandler);

  app.get("/api/sessions/oauth/google", googleOauthHandler);

  /**
   * @openapi
   * '/api/products':
   *  post:
   *     tags:
   *     - Products
   *     summary: Create a new product
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       200:
   *         description: Product created
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schemas/productResponse'
   *           example:
   *             "user": "642a0de05f16e6dad68efdad"
   *             "title": "Canon EOS 1500D DSLR Camera with 18-55mm Lens"
   *             "description": "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go."
   *             "price": 879.99
   *             "image": "https://i.imgur.com/QlRphfQ.jpg"
   *             "_id": "642a1cfcc1bec76d8a2e7ac2"
   *             "productId": "product_xxqm8z3eho"
   *             "createdAt": "2023-04-03T00:25:32.189Z"
   *             "updatedAt": "2023-04-03T00:25:32.189Z"
   *             "__v": 0
   */
  app.post(
    "/api/products",
    [requireUser, validate(createProductSchema)],
    createProductHandler
  );

  /**
   * @openapi
   * /api/products/{productId}:
   *  get:
   *    tags:
   *     - Products
   *    summary: Get a single product by the productId
   *    parameters:
   *      - name: productId
   *        in: path
   *        description: The id of the product
   *        required: true
   *    responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/productResponse'
   *       404:
   *         description: Product not found
   *  put:
   *     tags:
   *     - Products
   *     summary: Update a single product
   *     parameters:
   *      - name: productId
   *        in: path
   *        description: The id of the product
   *        required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schemas/productResponse'
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Product not found
   *  delete:
   *     tags:
   *     - Products
   *     summary: Delete a single product
   *     parameters:
   *      - name: productId
   *        in: path
   *        description: The id of the product
   *        required: true
   *     responses:
   *       200:
   *         description: Product deleted
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Product not found
   */

  app.put(
    "/api/products/:productId",
    [requireUser, validate(updateProductSchema)],
    updateProductHandler
  );

  app.get(
    "/api/products/:productId",
    validate(getProductSchema),
    getProductHandler
  );

  app.delete(
    "/api/products/:productId",
    [requireUser, validate(deleteProductSchema)],
    deleteProductHandler
  );

  app.post("/api/logout", logoutHandler);
}

export default routes;
