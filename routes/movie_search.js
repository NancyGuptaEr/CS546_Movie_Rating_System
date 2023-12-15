import { Router } from "express";
const router = Router();
import * as helpers from "../helper.js";
import * as searchMovies from '../data/search_movie.js';

router.route('/').get(async (req, res)   =>  {
    console.log("now i will try to open the homepage");
    try {
        res.render("home", {title: "CineRatings: Ratings, Reviews, and Where to Watch the Best Movies"});
    }catch(e)   {
        res.status(404).render("error", {errors: "Internal Server Error", title: "Error Occured!"});
    }
    })
    .post(async (req, res)  =>  {
        console.log("i have entered the post routes");
        let movieName = req.body.Search;
        console.log(movieName);
        try {
            console.log(`movie name before validation is ${movieName}`);
            movieName = helpers.checkStr(movieName, "Movie Name");
            console.log(`movie name after validation is ${movieName}`);
        }catch(error)   {
            res.status(404).render("error", {errors: "Internal Server Error", title: "Error Occured!"});
        }
        try {
            let searchedMovie = await searchMovies.searchMovies(movieName);
            console.log(`searched movie from database is`);
            console.log(searchedMovie);
    
            searchedMovie = searchedMovie.map(movie => {
                return  {
                    MovieId: movie._id,
                    Title: movie.title,
                    Genre: movie.genre,
                    Thumbnail: movie.thumbnail,
                    Rating: movie.overall_rating,
                    MPA: movie.contentRating
                };
            });
    
            if(searchedMovie.length === 0){
                res.render("searchpage", {MovieId: MovieId, title: "CineRatings: Ratings, Reviews, and Where to Watch the Best Movies", movies: searchedMovie, error: "No results found"});
            }
            res.render("searchpage", {title: "CineRatings: Ratings, Reviews, and Where to Watch the Best Movies", movies: searchedMovie});
        }catch(e)   {
            res.status(404).render("searchpage", {title: "CineRatings: Ratings, Reviews, and Where to Watch the Best Movies",movies: [], error: e});
        }
        });

router.route('/:MovieId')
    .get(async (req, res)   =>  {
        console.log("now i have entered routes to fetch single movie data");
        //code here to get a particular movie by name
        
        try {
            req.params.movieName = helpers.checkId(req.params.MovieId);

            console.log("i have done error checking in routes");

        }catch(e)   {
            return res.status(400).json({error: e});
        }

        try {
            const movie = await searchMovies.getSingleMovies(req.params.MovieId);
            console.log(movie);
            res.render("individualMovie", {
                title: movie.title, 
                genre: movie.genre, 
                releaseDate: movie.releaseDate, 
                director: movie.artists.director, 
                actors: movie.artists.actors, 
                writer: movie.artists.writer, 
                producer: movie.artists.producer, 
                mpa: movie.contentRating, 
                thumbnail: movie.thumbnail, 
                overall_rating: movie.overall_rating, 
                reviews: movie.reviews});
        }catch(e)   {
            res.status(404).render("error", {errors: "Internal Server Error", title: "Error Occured!"});
        }
    })
    .post(async (req, res)  =>  {
        console.log("i have entered routes to submit a review");
        //write code here to submit a review
        let userId = req.body.userID;
        console.log(`user id is ${userId}`);
        let rating = req.body.rating;
        console.log(`rating is ${rating}`);
        let review = req.body.review;
        console.log(`review is ${review}`);
        let movieId = req.params.MovieId;
        console.log(`movie id is ${movieId}`);
        try {
            userId = helpers.isValidEmail(userId);
            console.log(`user id is ${userId} after checking`);
            rating = helpers.isValidRating(rating);
            console.log(`rating is ${rating}`);
            review = helpers.checkReview(review);
            console.log(`review is ${review}`);
            movieId = helpers.checkId(movieId);
            console.log(`movie id is ${movieId}`);
            console.log("i have done all input validation in routes");
        
            const movie = await searchMovies.addReview(movieId, userId, rating, review);
            console.log(movie);
            res.render("individualMovie", {
                title: movie.title, 
                genre: movie.genre, 
                releaseDate: movie.releaseDate, 
                director: movie.artists.director, 
                actors: movie.artists.actors, 
                writer: movie.artists.writer, 
                producer: movie.artists.producer, 
                mpa: movie.contentRating, 
                thumbnail: movie.thumbnail, 
                overall_rating: movie.overall_rating, 
                reviews: movie.reviews, 
                userId: movie.reviews.userID, 
                rating: movie.reviews.rating, 
                review: movie.reviews.review, 
                ts: movie.reviews.ts});
        }catch(e)   {
            res.status(404).render("error", {errors: "Internal Server Error", title: "Error Occured!"});
        }
    });

export default router;