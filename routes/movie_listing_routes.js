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
            console.log(`printing watchlist `)
            let watchListNames = [];
            for (let watchlistName in userWatchListMovies){
                watchListNames.push(watchlistName);
            }
            console.log(watchListNames);
            res.render('movieListing',{Genres: moviesByGenre, recommendedMovies: topPicksForUser, UserWatchListMovies: userWatchListMovies, Top10: top10onCineRating, isLoggedIn: true, watchListNames: watchListNames, userId: userId});
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
    })
    .post(async (req,res)=>{

    });
    router.route('/add-to-watchlist')
        .get(async (req, res) => {
            console.log(`entered get of add to watchlist route`);
        })
        .post(async (req, res) => {
            console.log(`\n we are in post of add to watchlist route`);
            console.log(req.body);
        })

export default router;