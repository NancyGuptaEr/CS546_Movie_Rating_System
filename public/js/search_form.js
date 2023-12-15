
//this code will validate the search bar queries on client side
(function()  {
    const searchInput = document.getElementById("searchInput");
    const searchForm = document.getElementById("search-form");
    

    function clearMessages()    {
        let errors = document.getElementById("errors");
        errors.textContent = '';
    }

    function isValidMovieName(movieName)  {
        if(!movieName)  {
            throw `Please provide the movie name`; 
        }
        if(typeof movieName !== 'string')   {
            throw 'movie name must be of string type';
        }
        movieName = movieName.trim();
        if(movieName.length === 0)  {
            throw 'movie name cannot be just empty spaces';
        }
        return movieName;
    }

    function appendError(elementId, errorMessage){
        console.log(`printing elementId: ${elementId} | printing errorMessage: ${errorMessage}`);
        let listinHTML = document.getElementById(elementId);
        let createErrorList = document.createElement('li');
        createErrorList.textContent = errorMessage;
        listinHTML.appendChild(createErrorList);
    }
    console.log("now i am about to enter search form on client side");

    if(searchForm)  {
        searchForm.addEventListener('submit', event =>  {
            event.preventDefault();

            let movieInputValue = searchInput.value;
            console.log(`movie input before validation is ${movieInputValue}`);
            try{
                movieInputValue = isValidMovieName(movieInputValue);
                console.log(`movie input after validation is ${movieInputValue}`);

                if(movieInputValue) {
                    clearMessages();
                }

                if(movieInputValue) {
                    console.log("now i will submit it and client side is done");
                    searchForm.submit();
                }
            }catch(error)   {
                if(error)   {
                    console.log("now i have caught the error");
                    appendError('errors', error);
                    console.log(error);
                }
                
            }
        })
    }
})();

