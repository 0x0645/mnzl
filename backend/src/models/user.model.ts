import { prop, getModelForClass, modelOptions, DocumentType, pre } from "@typegoose/typegoose";
import argon2 from "argon2";
import log from "../utils/logger";

export const privateFields = [
    "password",
    "__v",
];


@pre<User>("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const hash = await argon2.hash(this.password);

    this.password = hash;

    return;
})
@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
    @prop({ required: true, unique: true, lowercase: true })
    email: string;

    @prop({ required: true })
    firstName: string;

    @prop({ required: true })
    lastName: string;

    @prop({ required: true })
    password: string;

    async validatePassword(this: DocumentType<User>, candidatePassword: string) {
        try {
            return await argon2.verify(this.password, candidatePassword);
        } catch (e) {
            log.error(e, "Could not validate password");
            return false;
        }
    }
}


const UserModel = getModelForClass(User);
export default UserModel;