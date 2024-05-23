import { prop, getModelForClass, Ref, modelOptions } from '@typegoose/typegoose';
import { User } from './user.model';
import { Movie } from './movie.model';
@modelOptions({ schemaOptions: { timestamps: true } })
class UserList {
    @prop({ ref: () => User, required: true })
    userId: Ref<User>;

    @prop({ required: true })
    title: string;

    @prop({ default: '' })
    description: string;

    @prop({ ref: () => Movie, default: [] })
    movies: Ref<Movie>[];
}

const UserListModel = getModelForClass(UserList);
export default UserListModel;
