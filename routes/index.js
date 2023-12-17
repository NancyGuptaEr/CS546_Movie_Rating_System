import authRoutes from './auth_routes.js';
import { adminMoviesRouter } from "./admin.js";
import movieListsRouter from "./movie_listing_routes.js";
import moviesSearchRoute from "./movie_search.js";
<<<<<<< HEAD
import userRoutes from './user.js';
=======
import deleteReviewRoute from "./deleteReview.js"
import watchListRoutes from './watchList_routes.js'

>>>>>>> 21995cae6e2b0bc983c3524161133e9bd4a7129d
const constructorMethod = (app) => {
    app.use('/', authRoutes);
    app.use("/admin", adminMoviesRouter);
    app.use("/login", authRoutes);
    console.log(`about hit /home in index`);
    app.use("/home", movieListsRouter);
<<<<<<< HEAD
    app.use("/landingPage", moviesSearchRoute);
    app.use("/movies",moviesSearchRoute)
    app.use('/users', userRoutes);
=======
    // app.use("/landingPage", moviesSearchRoute);
    app.use("/movies",moviesSearchRoute);
    app.use('/watchlist', watchListRoutes);
    app.use("/deleteReview", deleteReviewRoute);
    //app.use('/users', userRoutes);
>>>>>>> 21995cae6e2b0bc983c3524161133e9bd4a7129d
    app.use('*', (req, res) => {

        res.status(404).send("No such route exist.");
    });
};
export default constructorMethod;