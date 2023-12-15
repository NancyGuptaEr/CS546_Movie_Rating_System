(function() {
    const reviewForm = document.getElementById("reviewForm");

    function clearMessages()    {
        let errors = document.getElementById("errors");
        errors.textContent = '';
    }

    function isValidRating(rating)  {
        if(!rating) {
            throw 'rating is incorrect';
          }
          rating = Number(rating);
          if(typeof rating !== 'number')  {
            throw 'rating should be between 1-5 only';
          }
          if(rating === undefined || rating === null) {
            throw 'please provide the ratings';
          }
          if(rating <= 0 || rating > 5)   {
            throw 'ratings can be between 1 and 5 only';
          }
          if(!Number.isInteger(rating))   {
            throw 'rating should be a whole number only';
          }
          return rating;
    }
    function checkReview(review)    {
        if(!review) {
            throw 'review is not there';
          }
          if(typeof review !== 'string')  {
            throw 'review is not of proper type';
          }
          review = review.trim();
          if(review.length === 0) {
            throw 'review cannot be just empty spaces';
          }
          const regex = /^[a-zA-Z0-9\s,:;'"/!@()\-*$%&#]+$/;
          if(!regex.test(review)) {
            throw 'Review contains invalid characters';
          }
          return review;
    }
    function isValidEmail(emailId) {
        if(!emailId)    {
            throw 'Either the email address or password is invalid';
          }
          if(typeof emailId !== 'string') {
            throw 'Either the email address or password is invalid';
          }
          //check emailAddress should be a valid email address format
          //it should also be case insensitive
          emailId = emailId.trim();
          if(emailId.length === 0)    {
            throw 'Either the email address or password is invalid';
          }
          emailId = emailId.toLowerCase();
          emailId = emailId.replace(/\s+/g, '');
        
          //check if email id contains @
          if(!emailId.includes('@'))  {
            throw 'Either the email address or password is invalid';
          }
        
          //split the email id into prefix and suffix
          const [prefix, suffix] = emailId.split('@');
          const suffixExtra = suffix.split('.');
          //console.log(suffixExtra);
        
          //check if we have 2 dot's in suffix
          if(suffixExtra.length > 2) {
            throw 'Either the email address or password is invalid';
          }
        
          //valid prefix format
          const validPrefix = /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*$/;
          let boolPrefix = validPrefix.test(prefix);
        
          //valid domain format
          const validSuffix = /^[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
          let boolSuffix = validSuffix.test(suffix);
        
          if(boolPrefix === false || boolSuffix === false)    {
            throw 'Either the email address or password is invalid';
          }
        
          return emailId;
    }
    function appendError(elementId, errorMessage){
        console.log(`printing elementId: ${elementId} | printing errorMessage: ${errorMessage}`);
        let listinHTML = document.getElementById(elementId);
        let createErrorList = document.createElement('li');
        createErrorList.textContent = errorMessage;
        listinHTML.appendChild(createErrorList);
    }
    console.log("now i am about to enter search form on client side");

    if(reviewForm)  {
        reviewForm.addEventListener('submit', event =>  {
            event.preventDefault();

            let userIDValue = document.getElementById("userId");
            userIDValue = userIDValue.value;
            console.log(`user id before validation is ${userIDValue}`);
            let ratingValue = document.getElementById("rating");
            ratingValue = ratingValue.value;
            console.log(`rating before validation is ${ratingValue}`);
            let reviewValue = document.getElementById("userReview");
            reviewValue = reviewValue.value;
            console.log(`review before validation is ${reviewValue}`);

            try {
                userIDValue = isValidEmail(userIDValue);
                console.log(`user id after validation is ${userIDValue}`);
                ratingValue = isValidRating(ratingValue);
                console.log(`rating after validation is ${ratingValue}`);
                reviewValue = checkReview(reviewValue);
                console.log(`review after validation is ${reviewValue}`);

                if(userIDValue && ratingValue && reviewValue)   {
                    clearMessages();
                    console.log("submitting review now");
                    reviewForm.submit();
                }
            }catch(error)   {
                console.log("now i have caught the error");
                appendError('errors', error);
                console.log(error);
            }

        });
    }
})();