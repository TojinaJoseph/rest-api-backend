import { CookieOptions, Request, Response } from "express";
import {
  findAndUpdateUser,
  getGoogleOAuthtokens,
  getGoogleUser,
  validatePassword,
} from "../service/user.service";
import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";
import logger from "../utils/logger";

const accessTokenCookieOptions: CookieOptions = {
  maxAge: 900000,
  httpOnly: true,
  domain: "rest-api-backend-4zf8.onrender.com",
  path: "/",
  sameSite: "none",
  secure: true,
};

const refreshTokenCookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10,
};

export async function createSessionHandler(req: Request, res: Response) {
  //valiadte the users password
  const user = await validatePassword(req.body.email, req.body.password);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }
  //create a session

  const session = await createSession(user._id, req.get("user-agent") || "");

  //create an accesstoken

  const accessToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: config.get("accessTokenTtl") }
  );

  //create a refresh token

  const refreshToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: config.get("refreshTokenTtl") }
  );

  //return access and refreshtoken
  res.cookie("accessToken", accessToken, accessTokenCookieOptions);

  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;
  await updateSession({ _id: sessionId }, { valid: false });
  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}

export async function logoutHandler(req: Request, res: Response) {
  // Define a cookie options object with a very short maxAge
  const cookieOptions: CookieOptions = {
    maxAge: 0,
    httpOnly: true,
    domain: "rest-api-backend-4zf8.onrender.com", // Your backend domain
    path: "/",
    sameSite: "none",
    secure: true,
  };

  // Clear the accessToken and refreshToken cookies
  res.cookie("accessToken", "", cookieOptions);
  res.cookie("refreshToken", "", cookieOptions);

  // Send a success message or a redirect
  return res.status(200).json({
    message: "Logged out successfully!",
  });
}

export async function googleOauthHandler(req: Request, res: Response) {
  try {
    //get the code from qs
    const code = req.query.code as string;
    //get the id and access token with code
    const { id_token, access_token } = await getGoogleOAuthtokens({ code });

    //get user with tokens
    const googleUser = await getGoogleUser({ id_token, access_token });
    // jwt.decode(id_token)

    //upsert the user
    if (!googleUser.verified_email) {
      return res.status(403).send("Google account is not verified");
    }

    const user = await findAndUpdateUser(
      {
        email: googleUser.email,
      },
      {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
      {
        upsert: true,
        new: true,
      }
    );
    //create a session

    const session = await createSession(user?._id, req.get("user-agent") || "");

    //create acess and refresh tokens

    //create an accesstoken

    const accessToken = signJwt(
      {
        ...user?.toJSON(),
        session: session._id,
      },
      { expiresIn: config.get("accessTokenTtl") }
    );

    //create a refresh token

    const refreshToken = signJwt(
      {
        ...user?.toJSON(),
        session: session._id,
      },
      { expiresIn: config.get("refreshTokenTtl") }
    );

    //set cookies

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    //redirect back to the client

    res.redirect(config.get("origin"));
  } catch (error) {
    logger.error(error);
    return res.redirect(`${config.get("origin")}/oauth/error`);
  }
}
