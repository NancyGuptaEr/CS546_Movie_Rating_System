//Place all admin routes here.
import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { ObjectId } from "mongodb";
import { checkDate, checkStr, checkName } from "../helper.js";
import { adminMovies } from "../data/index.js";
import {
  createReviews,
  getMoviesByFlaggedTimes,
  removeByFlaggedTimes,
} from "../data/flaggedReviews.js";

export const adminMoviesRouter = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

adminMoviesRouter.route("/").get(async (req, res) => {
  try {
    const allMovies = await adminMovies.getAll();
    return res.render("admin", { allMovies });
  } catch (e) {
    return res.json({ error: "there are no movies in database" });
  }
});

adminMoviesRouter
  .get("/addMovie", async (req, res) => {
    const allGenres = [
      "action",
      "adventure",
      "comedy",
      "drama",
      "fantasy",
      "horror",
      "musicals",
      "mystery",
      "romance",
      "science fiction",
      "sports",
      "thriller",
      "western",
    ];
    res.render("uploadMovie", { allGenres });
  })
  .post("/addMovie", upload.single("image"), async (req, res) => {
    try {
      const data = req.body;
      if (!data) throw "input is required";
      let {
        title,
        genre,
        releaseDate,
        director,
        actors,
        writer,
        producer,
        ageRestriction,
      } = data;
      const thumbnail = req.file ? "/uploads/" + req.file.filename : "";
      title = checkStr(title, "title");
      if (!Array.isArray(genre)) throw "the type of genre must be array";
      releaseDate = checkDate(releaseDate, "releaseDate");
      director = checkName(director, "director");
      actors = checkStr(actors, "actors");
      actors = actors.split(",")?.map((eachName) => {
        eachName = checkName(eachName, eachName);
        return eachName;
      });
      if (!Array.isArray(actors)) throw "the type of genre must be array";
      if (writer !== "") writer = checkName(writer, "writer");
      producer = checkName(producer, "producer");
      if (ageRestriction === "false" || ageRestriction === "true")
        ageRestriction = !!ageRestriction;
      if (typeof ageRestriction !== "boolean")
        throw "the type of ageRestriction must be boolean";
      const newMovie = await adminMovies.addNewMovie(
        title,
        genre,
        releaseDate,
        director,
        actors,
        writer,
        producer,
        ageRestriction,
        thumbnail
      );
      return res.redirect("/admin");
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  });

adminMoviesRouter.route("/:movieId").delete(async (req, res) => {
  let id = req.params.movieId;
  try {
    id = checkStr(id, "movieId");
    if (!ObjectId.isValid(id)) throw "the movieId is not valid";
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const targetMovie = await adminMovies.getMovie(id);
  } catch (e) {
    return res.status(404).json({ error: "movie not found" });
  }
  try {
    const targetMovie = await adminMovies.remove(id);
    return res.json({ message: "movie deleted successfully" });
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

adminMoviesRouter.get("/update/:movieId", async (req, res) => {
  let movieId = req.params.movieId;
  try {
    movieId = checkStr(movieId, "movieId");
    if (!ObjectId.isValid(movieId)) throw "the movieId is not valid";
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const movie = await adminMovies.getMovie(movieId);
    const allGenres = [
      "action",
      "adventure",
      "comedy",
      "drama",
      "fantasy",
      "horror",
      "musicals",
      "mystery",
      "romance",
      "science fiction",
      "sports",
      "thriller",
      "western",
    ];
    const genresWithSelection = allGenres.map((genre) => {
      return { name: genre, selected: movie.genre.includes(genre) };
    });
    res.render("updateMovie", { movie, genresWithSelection });
  } catch (error) {
    res.status(404).send("Movie not found");
  }
});
adminMoviesRouter.post(
  "/toUpdate/:movieId",
  upload.single("image"),
  async (req, res) => {
    const movieId = req.params.movieId;
    const data = req.body;
    let id;
    try {
      id = checkStr(movieId, "movieId");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const targetMovie = await adminMovies.getMovie(id);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
    try {
      if (!data) throw "input is required";
      let {
        title,
        genre,
        releaseDate,
        director,
        actors,
        writer,
        producer,
        ageRestriction,
      } = data;

      const thumbnail = req.file ? "/uploads/" + req.file.filename : "";
      title = checkStr(title, "title");
      if (!Array.isArray(genre)) throw "the type of array must be array";
      releaseDate = checkDate(releaseDate, "releaseDate");
      director = checkName(director, "director");
      if (writer !== "") writer = checkName(writer, "writer");
      producer = checkName(producer, "producer");
      actors = checkStr(actors, "actors");
      actors = actors.split(",")?.map((eachName) => {
        eachName = checkName(eachName, eachName);
        return eachName;
      });
      const artists = {
        director: [director],
        actors,
        producer: [producer],
        ...(writer !== undefined && { writer: [writer] }),
      };
      if (typeof artists !== "object" || Array.isArray(artists))
        throw "the type of artists must be object";
      ageRestriction =
        ageRestriction === "true"
          ? true
          : ageRestriction === "false"
          ? false
          : ageRestriction;
      if (typeof ageRestriction !== "boolean")
        throw "the type of ageRestriction must be boolean";
      const newMovie = await adminMovies.update(
        id,
        title,
        genre,
        releaseDate,
        artists,
        ageRestriction,
        thumbnail
      );
      if (newMovie) return res.redirect("/admin");
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  }
);

adminMoviesRouter.post("/addReview/:movieId", async (req, res) => {
  const movieId = req.params.movieId;
  const data = req.body;
  const { userId, text, rating, ts, flaggedTimes } = data;
  try {
    const review = await createReviews(
      movieId,
      userId,
      text,
      rating,
      ts,
      flaggedTimes
    );
    return res.status(200).json("succeed");
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

adminMoviesRouter.get("/flaggedReviews", async (req, res) => {
  try {
    const allFlaggedReviews = await getMoviesByFlaggedTimes();
    return res.render("flaggedReviews", { allFlaggedReviews });
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

adminMoviesRouter.delete("/flaggedReviews/:reviewId", async (req, res) => {
  let reviewId = req.params.reviewId;
  try {
    reviewId = checkStr(reviewId, "reviewId");
    if (!ObjectId.isValid(reviewId)) throw "the reviewId is not valid";
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const deleteInfo = await removeByFlaggedTimes(reviewId);
    if (!deleteInfo) throw "deleting failed";
    return res.render("flaggedReviews");
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});
