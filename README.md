CS_546_Group_21

Read Me

Github repo : https://github.com/NancyGuptaEr/CS546_Movie_Rating_System/

Group members: [1] Nancy Gupta [2] Janghao Huang [3] Yash Yatinkumar Gandhi [4] Vivek Balikishan Singh

Project Overview: Cineratings

What you need to do to run this project.. First seed data to database using following steps : ● npm install ● node seed.js ● npm start

User Login Details Email : whatsapp@samsung.com password : Secure@123

Admin Login Details Email : abc@gmail.com Password : Qwerty1!

Admin route : http://localhost:3000/admin

Local machine time zone must be in 24 hrs format.

*Core Features Implemented :

1.Landing Page: • Provides an overview of the service’s purpose and motivation. • There will be a search bar throughout all the pages, using this search bar users can search the movies based on the movie name.

2.Movie Listing Page: • This page will have movies arranged by their genre in the first section. • There will be another section which will recommend movies based on users genre (users preferred genres will be asked during registration). • And the third section will recommend movies from users watchlist.

3.Individual movie page: • Presents comprehensive information about the movie, including cast, director, genre, release date, and user-generated reviews. • Displays a list of reviews, truncated reviews text, and user ratings. In this section a user can post reviews and can edit them as well.

4.User Profiles: • Users can create their profiles with usernames and profile pictures. • They can set their preferred genres. • They can also set content rating for their account e.g.: MPA(U.S.A) uses G, PG, PG-13, etc ratings for the movies.

5.Multiple Watchlists: • Users will be able to create multiple watchlists like if they want to watch a bunch of movies in summer, they can create a summer watchlist and similarly if they want to watch another bunch of movies in fall they can create fall watch list.

6.Movie management page: • Provides a feature for admin to add or remove movies to and from the database including details such as title, genre, and release date. • Admin can also change most of the information related to a movie namely genre, release date, etc. • If a review is flagged as inappropriate by multiple users admin can review that review and remove it.

Guest Users Even without being logged in, Users can search for movie based on movie name, see individual movie page and movie listing page as well which will display the movies as per the genre
