import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
@modelOptions({ schemaOptions: { timestamps: true } })
export class Movie {
    @prop({ required: true, unique: true })
    movieId: string;

    @prop({ required: true })
    title: string;

    @prop()
    overview?: string;

    @prop()
    releaseDate?: string;

    @prop()
    posterPath?: string;
}

const MovieModel = getModelForClass(Movie);
export default MovieModel;
