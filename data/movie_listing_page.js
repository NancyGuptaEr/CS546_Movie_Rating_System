import { movies, users } from "../config/mongoCollections.js";
import * as please from '../helper.js'
/////////////  ALL OF THIS IS FOR GETTING MOVIES FOR THE MOVIE LISTING PAGE  ////////////////

let exportedMethods = {

    async getMoviesByGenreWithoutLogin(){

        const movieData = await movies();
        const genreList = await movieData.distinct('Genre');
        // console.log(`All genres in the collection: ${genreList}`);
        
        function chooseRandom(Array){
            // console.log(`overall Array length = :${Array.length}`);  
            const randomChoice = Math.floor(Math.random()*10) % Array.length;
            // console.log(`selected Array index: ${randomChoice}`);
            let returnValue = Array[randomChoice];
            return returnValue;
        }
        
        let uniqueGenres = new Set();

        while (uniqueGenres.size != 3){
            let newGenre = chooseRandom(genreList);
            // console.log(`newGenre=: ${newGenre}`);
            uniqueGenres.add(newGenre);
        }
        uniqueGenres = Array.from(uniqueGenres);
        const movieListProjection = {_id: 0, Thumbnail: 1, Title: 1, overall_rating: 1};
        let returnMovieObject = {};

        for (let i = 0; i < uniqueGenres.length; i++){
            const movieList = await movieData.find({Genre: uniqueGenres[i]}).project(movieListProjection).limit(10).toArray();
            returnMovieObject[uniqueGenres[i]] = movieList;
        }

        // console.log(returnMovieObject); // till here we have random genre and movies with

        return returnMovieObject;

    },

    async getMoviesWithLogin(userName){

        userName = please.checkStr(userName, "User Name");
        console.log(userName);
        return;
        const userData = await users();
        const genreProjection = {_id : 0, Age: 1, preferGenre: 1}
        let userPreference = await userData.find({userName : userName}).project(genreProjection).toArray(); //First we'll need to get user genres 
        // console.log(`Prefered genres of user: `);
        // console.log(userPreference);
        const preferedGenres = userPreference[0].preferGenre; // here preferedGenres contains all the Genres that user loves
        const minAge = userPreference[0].Age;
        // console.log(`age of user: ${minAge}`);
        const contentRatings = ['G','PG','PG-13','R','NC-17'];
        const minAgeContentRating = [1,1,13,17,18];
        

        function returnContentRatings(minimumAge){
            // console.log(`minimum age content for the user: ${minimumAge}`);
            let contentRating = [];
            let index = 0;

            for (let i=0 ; i < minAgeContentRating.length; i++){
                if(minAgeContentRating[i] >= minimumAge){
                    
                    index = i;
                    // console.log(`max age limit is at location: ${i}`);
                    break;
                }
                else{
                    index = 5;
                }
            }

            for (let j = 0 ; j < index; j++ ){
                contentRating.push(contentRatings[j]);
            }
            return contentRating;
        }
        const allowedContentRatings = returnContentRatings(minAge);

        // console.log(`user preferedGenres are: ${preferedGenres}`);
        // console.log(`content ratings for user: ${allowedContentRatings}`);
        const movieData = await movies();
        const movieListProjection = {_id: 0, Thumbnail: 1, Title: 1, overall_rating: 1};
        let movieListByGenre = {};

        for (let i = 0; i < preferedGenres.length; i++){
            const movieList = await movieData.find({Genre: preferedGenres[i], contentRating: {$in: allowedContentRatings}}).project(movieListProjection).limit(10).toArray();
            const genre = preferedGenres[i]
            if(movieList.length != 0){
                movieListByGenre[genre] = movieList;
            }
            // console.log(`printing movieList :`);
            // console.log(movieList);
        }
        // console.log(`Below is the movie list`);
        // console.log(movieListByGenre); // Till here we have movies by user genres

        ///////////// From here we'll need to have movies from users watchlist
        const watchlistProjection = {_id: 0, watchlist: 1}
        let watchlist = await userData.find({userName: userName}).project(watchlistProjection).toArray();
        watchlist = watchlist[0].watchlist;
        let retrunArray = [];
        const firstSection = await this.getMoviesByGenreWithoutLogin();
        // console.log(`firstSection`);
        // console.log(firstSection);

        // retrunArray.push(firstSection);
        // retrunArray.push(movieListByGenre);
        // retrunArray.push(watchlist);
        console.log(`firstSection `)
        console.log(firstSection);
        console.log(`_____________________________________________________________`);
        console.log(`movie List By Genre`);
        console.log(movieListByGenre);
        console.log(`_____________________________________________________________`);
        console.log(`movies from watchlist`);
        console.log(watchlist);
        console.log(`_____________________________________________________________`);
        // console.log(retrunArray);
        // console.log(`______________________________________________________________`);
        // console.log(`user watchlists: `);
        // console.log(watchlist);
        return retrunArray;
    }
}

export default exportedMethods;