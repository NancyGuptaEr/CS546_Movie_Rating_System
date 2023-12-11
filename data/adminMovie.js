import { checkStr, checkDate, checkName } from "../helper.js";
import { movies } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const getMovie = async (movieId) => {
  const id = checkStr(movieId, "movieId");
  if (!ObjectId.isValid(id)) throw "the movieId is not valid!";
  const moviesCollection = await movies();
  const movieInfo = await moviesCollection.findOne({
    _id: new ObjectId(id),
  });
  if (!movieInfo) throw "the movie with this id does not exist";
  movieInfo._id = movieInfo._id.toString();
  return movieInfo;
};

export const getAll = async () => {
  const moviesCollection = await movies();
  const allObjIdMovies = await moviesCollection.find().toArray();
  const allMovies = allObjIdMovies
    .map((movie) => {
      if (!movie._id) {
        console.log("Missing _id", movie);
        return null;
      }
      return {
        _id: movie._id.toString(),
        movieName: movie.title,
        thumbnailUrl: movie.thumbnail,
        director: movie.artists.director,
        actors: movie.artists.actors,
        genre: movie.genre,
        overall_rating: movie.overall_rating,
        contentRating: movie.contentRating,
      };
    })
    .filter((e) => e);
  return allMovies;
};

export const addNewMovie = async (
  title,
  genre,
  releaseDate,
  director,
  actors,
  writer,
  producer,
  contentRating,
  thumbnail
) => {
  title = checkStr(title, "title");
  if (!Array.isArray(genre)) throw "the type of genre must be array";
  releaseDate = checkDate(releaseDate, "releaseDate");
  director = checkName(director, "director");
  if (!Array.isArray(actors)) throw "the type of actors must be array";
  actors = actors.map((eachName) => {
    eachName = checkName(eachName, eachName);
    return eachName;
  });
  if (writer !== "") writer = checkName(writer, "writer");
  producer = checkName(producer, "producer");
  const allContentRatings = ["G", "PG", "PG-13", "R", "NC-17"];
  if (!allContentRatings.includes(contentRating))
    throw "contentRating is not valid";
  if (
    !thumbnail.match(
      /^\/uploads\/[0-9]{13}-[a-zA-Z_0-9]{0,20}\.(jpg|bmp|png)$/g
    )
  )
    throw "the format of thumbnail is not right";
  const artists = {
    director: [director],
    actors,
    ...(writer !== "" && { writer: [writer] }),
    producer: [producer],
  };
  const newMovie = {
    title,
    genre,
    releaseDate,
    artists,
    contentRating,
    reviews: [],
    thumbnail,
    overall_rating: "0",
  };
  const moviesCollection = await movies();
  const insertInfo = await moviesCollection.insertOne(newMovie);
  if (insertInfo.acknowledged !== true) throw "create new movies failed";
  const movie = await getMovie(insertInfo.insertedId.toString());
  return movie;
};

export const remove = async (movieId) => {
  const id = checkStr(movieId, "movieId");
  if (!ObjectId.isValid(id)) throw "the movieId is not valid";
  const moviesCollection = await movies();
  const theMovie = await getMovie(id);
  if (!theMovie) throw "the movie with this id does not exist";
  const deleteInfo = await moviesCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });
  if (!deleteInfo) throw "delete failed";
  return { movieName: theMovie.title, deleted: true };
};

export const update = async (
  movieId,
  title,
  genre,
  releaseDate,
  artists,
  contentRating,
  thumbnail
) => {
  const id = checkStr(movieId, "movieId");
  title = checkStr(title, "title");
  if (!Array.isArray(genre)) throw "the type of array must be array";
  releaseDate = checkDate(releaseDate, "releaseDate");
  if (typeof artists !== "object" || Array.isArray(artists))
    throw "the type of artists must be object";
  const allContentRatings = ["G", "PG", "PG-13", "R", "NC-17"];
  if (!allContentRatings.includes(contentRating))
    throw "contentRating is not valid";
  const moviesCollection = await movies();
  const targetMovie = await moviesCollection.findOne({ _id: new ObjectId(id) });
  if (!targetMovie) throw "the movie does not exist";
  const updateInfo = await moviesCollection.findOneAndUpdate(
    {
      _id: new ObjectId(id),
    },
    { $set: { title, genre, releaseDate, artists, contentRating, thumbnail } },
    { returnDocument: "after" }
  );
  if (!updateInfo) throw "update failed";
  return updateInfo;
};
