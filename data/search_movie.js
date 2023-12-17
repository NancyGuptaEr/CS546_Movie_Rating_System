
import { ObjectId } from "mongodb";
import {movies} from "../config/mongoCollections.js";
import * as helpers from "../helper.js";


//core feature no 1..search movies from search bar on landing page
const searchMovies = async(movieName)   =>  {
    //implement code here
    console.log("i have entered search movies in data file");

    movieName = helpers.checkStr(movieName, "Movie Name");
    console.log(`movie name to search for is ${movieName}`);

    const movieCollection = await movies();
    //let movieRegex = new RegExp(movieName, 'i');
    let movieRegex = new RegExp(`.*${movieName}.*`, 'i');

    console.log(`movie regex is ${movieRegex}`);
    const mysearchMovie = await movieCollection.find({title: {$regex: movieRegex}}).toArray();
    console.log("i have found the movie which the user was searching for ");
    console.log(mysearchMovie);
    console.log(typeof mysearchMovie);

    if(mysearchMovie.length === 0)  {
        console.log("i am about to throw error");
        throw 'No such movie exists';
    }
    console.log("now i will exit data file");

    return mysearchMovie;
}

//Core feature No 3- Individual movie page
//core feature no 3 - part (a)
//here i am writing a function Presents comprehensive information about the movie, including cast, director, genre, release date, and user-generated reviews.
const getSingleMovies = async(movieId)  =>  {

    console.log("i have entered movies in data file to fetch single movieS");

    movieId = helpers.checkId(movieId);
    console.log(`movie id is ${movieId}`);
    const movieCollection = await movies();
    const myMovie = await movieCollection.findOne({_id: new ObjectId(movieId)});
    console.log(`found movie name from collection`);
    console.log(myMovie);

    if(!myMovie)    {
        throw 'No movie found with that name';
    }
  
    //return the movie
    return myMovie;
}

const addReview = async(movieId, userId, rating, review)  =>  {
    console.log("i have entered data file to submit a review");
    movieId = helpers.checkId(movieId);
    review = helpers.checkReview(review);
    rating = helpers.isValidRating(rating);
    console.log(`user id in data file before validation is ${userId}`);
    userId = helpers.isValidEmail(userId);
    console.log(`user id in data file after validation is ${userId}`);

    console.log("i have done input validation in data file");
    console.log(`my movie id for which review is to be posted is ${movieId}`);

    const movieCollection = await movies();
    let movie = await movieCollection.findOne({_id: new ObjectId(movieId)});
    console.log(`movie id after finding is`);
    console.log(movie);

    if(!movie)  {
        throw 'could not find movie for which you want to submit the review';
    }

    const existingUserIndex = movie.reviews.findIndex((user)  => user.userId === userId);
    console.log(existingUserIndex);
    const formattedDate = new Date().toISOString().split('T')[0];
    console.log(`formatted date is ${formattedDate}`);

    if(existingUserIndex !== -1)    { // this means the review exists by that user Id
        movie.reviews[existingUserIndex] = {userId, rating, review, ts: formattedDate};
        // movie.Reviews = movie.Reviews.filter(user   =>  user.userId !== userId);
    }else   {
        movie.reviews.push({userId, rating, review, ts: formattedDate,flaggedTimes: 0});
    }
    
    console.log("i have inserted the review in database");
    

    const allRatings = movie.reviews.map((review)    => review.rating);
    const totalRatings = allRatings.reduce((acc, curr)  =>  acc+curr, 0);
    let existingRating = movie.overall_rating || 0;
    console.log(`existing rating is ${existingRating}`);

    const newOverallRatings = ((totalRatings + existingRating)/(movie.reviews.length + 1)).toFixed(1);
    movie.overall_rating = parseFloat(newOverallRatings);
    console.log(`new rating after doing average is ${newOverallRatings}`);

    const updatedInfo = await movieCollection.findOneAndUpdate(
        {_id: new ObjectId(movieId)},
        {$set: {reviews: movie.reviews, overall_rating: movie.overall_rating}},
        {returnDocument: 'after'}
    );
    if(!updatedInfo)    {
        throw 'could not add the review successfully';
    }
    console.log("now i will submit and update the review");
    return updatedInfo;
}

const deleteReview = async(userId, movieId) =>  {
    console.log("i have entered data file to delete the review");
    console.log(`userId : ${userId}`);
    console.log(`movie id: ${movieId}`);
    movieId = helpers.checkId(movieId);
    console.log(`movie id in data file before validation is ${userId}`);
    userId = helpers.isValidEmail(userId);
    console.log(`user id in data file after validation is ${userId}`);

    console.log("i have done input validation in data file for deleting the review"); 
    console.log(`my movie id for which i want to delete the review is ${movieId}`);

    const movieCollection = await movies();
    let movie = await movieCollection.findOne({_id: new ObjectId(movieId)});
    console.log(`movie for which review is to be deleted is`);
    console.log(movie);
    console.log("__________________________");
    if(!movie)  {
        throw 'movie not found';
    }
    
    const reviewIndex = movie.reviews.findIndex((review)    => review.userId === userId);

    if(reviewIndex === -1)  {
        throw 'Review could not be found';
    }
    const removeReview = movie.reviews.splice(reviewIndex, 1)[0];

    const totalRatings = movie.reviews.reduce((sum, review) =>  sum + review.rating, 0);
    movie.overall_rating = movie.reviews.length > 0? totalRatings/movie.reviews.length : 0;

    const updatedMovie = await movieCollection.updateOne(
        {_id: new ObjectId(movieId)},
        {$set: {
            reviews: movie.reviews,
            overall_rating: movie.overall_rating
        }
        }
    );

    console.log("review has been successfully deleted");
    return updatedMovie;
}

export  {
    searchMovies,
    getSingleMovies,
    addReview, 
    deleteReview
};