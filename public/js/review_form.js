//to post a review on individual movie image

$(document).ready(function()  {
  function clearMessages()    {
    let errors = document.getElementById("errors");
    errors.textContent = '';
  }
  function appendError(elementId, errorMessage){
    console.log(`printing elementId: ${elementId} | printing errorMessage: ${errorMessage}`);
    let listinHTML = document.getElementById(elementId);
    let createErrorList = document.createElement('li');
    createErrorList.textContent = errorMessage;
    listinHTML.appendChild(createErrorList);
  }
  $('#reviewForm').on('submit', function(event) {
    event.preventDefault();
    try {
      let ratingValue = $('#rating').val();
      console.log(`rating: ${ratingValue}`);
      let reviewValue = $('#userReview').val();
      console.log(`review: ${reviewValue}`);
      let movieId = $('#movieId').val()
      console.log(`movieid: ${movieId}`);

      if(!ratingValue) {
        throw 'rating is incorrect';
      }
      ratingValue = Number(ratingValue);
      if(typeof ratingValue !== 'number')  {
        throw 'rating should be between 1-5 only';
      }
      if(ratingValue === undefined || ratingValue === null) {
        throw 'please provide the ratings';
      }
      if(ratingValue <= 0 || ratingValue > 5)   {
        throw 'ratings can be between 1 and 5 only';
      }
      if(!reviewValue) {
        throw 'review is not there';
      }
      if(typeof reviewValue !== 'string')  {
        throw 'review is not of proper type';
      }
      reviewValue = reviewValue.trim();
      if(reviewValue.length === 0) {
        throw 'review cannot be just empty spaces';
      }
      const regex = /^[a-zA-Z0-9\s,:;'"/!@()\[\]\-*$%&#^+=.]+$/;
      if(!regex.test(reviewValue)) {
        throw 'Review contains invalid characters';
      }
      if(!movieId){
        throw `Please provide movieId`;
      }
      if(typeof movieId !== "string"){
        throw `movieId should only be of type string`
      }
      movieId = movieId.trim();
      if(movieId.length === 0){
        throw `movieid can't be just empty spaces`;
      }

      console.log('entering ajax');
      $.ajax({
        url: '/movies/:MovieId',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          reviewValue: reviewValue,
          ratingValue: ratingValue,
          movieId: movieId
        }),
        success: function(response) {
          alert('Review has been posted successfully');
          window.location.reload();
          console.log('Review has been posted successfully');
        },
        error:function(error) {
          console.error('Error posting review:', error);
        }
      })


    }catch(error) {
      if(error) {
        console.log("now i have caught the error");
        appendError('errors', error);
        console.log(error);
      }
    }
  });

});
function scrollToBottom() {
    document.getElementById('bottom').scrollIntoView({ behavior: 'smooth' });
  }


//to delete a review on individual movie page
function deleteReview(selectElement, movieId) {
  console.log(`entered delete client side`)
  var movieId = selectElement.getAttribute('data-movieID');
  console.log(`mvid: ${movieId}`)
  try {
    if(!movieId){
      throw `Please provide movieId`;
    }
    if(typeof movieId !== "string"){
      throw `movieId should only be of type string`
    }
    movieId = movieId.trim();
    if(movieId.length === 0){
      throw `movieid can't be just empty spaces`;
    }
    console.log('entering ajax to delete the review');
    console.log(`movieId: ${movieId}`);
    $.ajax({
      url: `/deleteReview`,
      type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          movieId: movieId
        }),
        success: function(response) {
          alert('Review has been deleted successfully');
          window.location.reload();
          console.log('Review has been deleted successfully');
        },
        error:function(error) {
          console.error('Error deleting review:', error);
        }
    })

  }catch(error) {
    if(error) {
      console.log("now i have caught the error");
      appendError('errors', error);
      console.log(error);
    }
  }
}