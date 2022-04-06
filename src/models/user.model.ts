import mongoose from "mongoose";

interface IUser {
  name: string;
  email: string;
  todos: {
    title: string;
    description: string;
  }[];
}

interface userModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc;
}

export interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  todos: {
    title: string;
    description: string;
  }[];
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },

  todos: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.statics.build = (attr: IUser) => {
  return new UserModel(attr);
};

const UserModel = mongoose.model<UserDoc, userModelInterface>(
  "User",
  userSchema
);

export default UserModel;
