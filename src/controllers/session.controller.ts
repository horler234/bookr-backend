import { CookieOptions, Request, Response } from "express";
// import {
//   createSession,
//   findSessions,
//   updateSession,
// } from "../src/service/session.service";
import {
  findAndUpdateUser,
  getGoogleOAuthTokens,
  getGoogleUser,
  // validatePassword,
} from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
// import log from "../utils/logger";

const accessTokenCookieOptions: CookieOptions = {
  maxAge: 900000, // 15 mins
  httpOnly: true,
  domain: "localhost",
  path: "/",
  sameSite: "lax",
  secure: false,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10, // 1 year
};

// export async function createUserSessionHandler(req: Request, res: Response) {
//   // Validate the user's password
//   // const user = await validatePassword(req.body);

//   if (!user) {
//     return res.status(401).send("Invalid email or password");
//   }

//   // create a session
//   const session = await createSession(user._id, req.get("user-agent") || "");

//   // create an access token

//   const accessToken = signJwt(
//     { ...user, session: session._id },
//     { expiresIn: config.get("accessTokenTtl") } // 15 minutes
//   );

//   // create a refresh token
//   const refreshToken = signJwt(
//     { ...user, session: session._id },
//     { expiresIn: config.get("refreshTokenTtl") } // 15 minutes
//   );

//   // return access & refresh tokens

//   res.cookie("accessToken", accessToken, accessTokenCookieOptions);

//   res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

//   return res.send({ accessToken, refreshToken });
// }

// export async function getUserSessionsHandler(req: Request, res: Response) {
//   const userId = res.locals.user._id;

//   const sessions = await findSessions({ user: userId, valid: true });

//   return res.send(sessions);
// }

// export async function deleteSessionHandler(req: Request, res: Response) {
//   const sessionId = res.locals.user.session;

//   await updateSession({ _id: sessionId }, { valid: false });

//   return res.send({
//     accessToken: null,
//     refreshToken: null,
//   });
// }

export async function googleOauthHandler(req: Request, res: Response) {
  // get the code from qs
  const code = req.query.code as string;
  console.log("see", code);

  try {
    // get the id and access token with the code
    const { id_token, access_token } = await getGoogleOAuthTokens({ code });
    console.log({ id_token, access_token });

    // get user with tokens
    const googleUser = await getGoogleUser({ id_token, access_token });
    //jwt.decode(id_token);

    console.log({ googleUser });

    if (!googleUser.verified_email) {
      return res.status(403).send("Google account is not verified");
    }

    // upsert the user
    const user = await findAndUpdateUser(
      {
        email: googleUser.email,
      },
      {
        email: googleUser.email,
        name: googleUser.name,
        todos: [],
      },
      {
        upsert: true,
        new: true,
      }
    );

    // create a session
    // create a session
    // const session = await createSession(user._id, req.get("user-agent") || "");

    // create an access token

    const accessToken = signJwt(
      { user_id: user?._id, email: user?.email },
      { expiresIn: 15 * 60 * 1000 } // 15 minutes
    );

    // create a refresh token
    const refreshToken = signJwt(
      { user_id: user?._id },
      { expiresIn: 365 * 24 * 60 * 60 * 1000 } // 1 year
    );

    res.redirect(`http://localhost:3000?user=${user?._id}`);

    // res
    //   .status(200)
    //   .json({ user, access_token: accessToken, refresh_token: refreshToken });

    // res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
    // res.cookie("accessToken", accessToken, accessTokenCookieOptions);

    // redirect back to client
  } catch (error) {
    return res.redirect(`http://localhost:8080/oauth/error`);
  }
}
