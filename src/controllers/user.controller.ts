import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { createUser } from "../service/user.service";
import { signJwt, verifyJwt } from "../utils/jwt.utils";

export async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);
    return res.send(user);
  } catch (e: any) {
    return res.status(409).send(e.message);
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  return res.send(res.locals.user);
}

export const loginUser = async (req: Request, res: Response) => {
  // Our login logic starts here
  try {
    // Get user input
    const { id } = req.body;

    // Validate user input

    // Validate if user exist in our database
    const user = await UserModel.findById(id);

    const accessToken = signJwt(
      { user_id: user?._id },
      { expiresIn: 365 * 24 * 60 * 60 * 1000 } // 15 minutes
    );

    // create a refresh token
    const refreshToken = signJwt(
      { user_id: user?._id },
      { expiresIn: 365 * 24 * 60 * 60 * 1000 } // 1 year
    );

    // user
    res.status(200).json({
      ...user,
      // refresh_token: refreshToken,
      token: accessToken,
    });
  } catch (err) {
    console.log(err);
  }
};
export const addTodo = async (req: Request, res: Response) => {
  // Our login logic starts here
  try {
    // Get user input
    const token = req.headers.authorization?.split(" ")[1];
    const { title, desc } = req.body;
    const decodedToken = token && verifyJwt(token);

    //@ts-ignore
    const id = decodedToken?.decoded.user_id;

    const user = await UserModel.findById(id);
    console.log(user);

    // Validate user input

    // Validate if user exist in our database
    // const user = await UserModel.findById(id);

    // const accessToken = signJwt(
    //   { user_id: user?._id },
    //   { expiresIn: 365 * 24 * 60 * 60 * 1000 } // 15 minutes
    // );

    // // create a refresh token
    // const refreshToken = signJwt(
    //   { user_id: user?._id },
    //   { expiresIn: 365 * 24 * 60 * 60 * 1000 } // 1 year
    // );

    // // user
    // res.status(200).json({
    //   ...user,
    //   // refresh_token: refreshToken,
    //   token: accessToken,
    // });
  } catch (err) {
    console.log(err);
  }
};
