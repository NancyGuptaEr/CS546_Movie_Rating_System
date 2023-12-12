import { Router } from "express";
import { movieListingDataFuncs } from "../data/index.js";

const router = Router();

router
    .route('/')
    .get(async (req, res) => {
       
        // console.log(top10onCineRating);
        if(req.session.user){
            console.log(`we do have a user session....`);
            console.log(req.session.user);
            const userId = req.session.user._id;
            // console.log(userEmailAddress)
            const movieInfo = await movieListingDataFuncs.getMoviesWithLogin(userId);
            console.log(movieInfo[1]);
            const moviesByGenre = movieInfo[0];
            const topPicksForUser = movieInfo[1];
            const userWatchListMovies = movieInfo[2];
            const top10onCineRating = movieInfo[3];
            console.log(`printing top10oncinerating: `)
            console.log(top10onCineRating);
            res.render('movieListing',{Genres: moviesByGenre, recommendedMovies: topPicksForUser, UserWatchListMovies: userWatchListMovies, Top10: top10onCineRating});
        }
        else {
            const movieInfo = await movieListingDataFuncs.getMoviesByGenreWithoutLogin();
            const moviesByGenre = movieInfo[1]; //This is an object which contains 3 random genres 
            //and their respective movies in array which are again an object of {title,thumbnail,overall_rating}
            const top10onCineRating = movieInfo[0]; //This is an object containing top 10 movies on cineratings
            console.log(`printing top10oncineratings withoutloggin `);
            console.log(top10onCineRating);
            console.log(`______________________________________________`);
            res.render('movieListing',{title: 'CineRatings', Genres: moviesByGenre, Top10: top10onCineRating});
        }
    });

export default router;