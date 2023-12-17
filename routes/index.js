import authRoutes from './auth_routes.js';
import { adminMoviesRouter } from "./admin.js";
import movieListsRouter from "./movie_listing_routes.js";
import moviesSearchRoute from "./movie_search.js";
import deleteReviewRoute from "./deleteReview.js"

const constructorMethod = (app) => {
    app.use('/',authRoutes);
    app.use("/admin", adminMoviesRouter);
    app.use("/login", authRoutes);
    app.use("/home", movieListsRouter);
    // app.use("/landingPage", moviesSearchRoute);
    app.use("/movies",moviesSearchRoute)
    app.use("/deleteReview", deleteReviewRoute);
    //app.use('/users', userRoutes);
    app.use('*', (req, res) => {

        res.status(404).send("No such route exist.");
    });
};
export default constructorMethod;