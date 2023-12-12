// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submit event when the form is submitted and If there is an error in the user's input or they are missing fields, you will not allow the form to submit to the server and will display an error on the page to the user informing them of what was incorrect or missing.  You must do this for ALL fields for the register form as well as the login form. If the form being submitted has all valid data, then you will allow it to submit to the server for processing. Don't forget to check that password and confirm password match on the registration form!

$(document).ready(function () {
  const checkName = (param, paramName) => {
    if (!param.match(/^[a-z]{0,10}( [a-z]{0,10}){1,2}$/gi))
      throw `${paramName} must consist of letters and 2-3 spaces`;
    return param;
  };

  const checkDate = (date) => {
    if (
      !date.match(
        /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[0-1])\/[12][0-9]{3}$/gim
      )
    )
      throw `${whatDate} type is invalid`;
    const [month, day, year] = date.split("/");
    const formatDate = new Date(year, month - 1, day);
    if (
      !(
        formatDate.getFullYear() === +year &&
        formatDate.getMonth() + 1 === +month &&
        formatDate.getDate() === +day
      )
    )
      throw `${whatDate} is invalid`;
    return date;
  };

  $("#addMovieForm").on("submit", function (e) {
    var isValid = true;
    var errorMessage = "";

    if ($("#movieName").val().trim() === "") {
      errorMessage += "Title is required.<br>";
      isValid = false;
    }
    try {
      checkName($("#director").val().trim(), "director");
    } catch (error) {
      errorMessage += "format of director is wrong.<br>";
      isValid = false;
    }
    try {
      const actorsInput = $("#actors").val().trim();
      if (actorsInput === "") throw "actors must exist";
      const actors = actorsInput.split(",")?.map((e) => {
        return checkName(e.trim(), e);
      });
    } catch (error) {
      errorMessage += "format of actors is wrong.<br>";
      isValid = false;
    }
    try {
      const writer = $("#writer").val().trim();
      if (writer !== "") checkName(writer, "writer");
    } catch (error) {
      errorMessage += "format of writer is wrong.<br>";
      isValid = false;
    }
    try {
      checkName($("#producer").val().trim(), "producer");
    } catch (error) {
      errorMessage += "format of producer is wrong.<br>";
      isValid = false;
    }
    try {
      checkDate($("#releaseDate").val().trim(), "Release Date");
    } catch (error) {
      errorMessage += "releaseDate is invalid.<br>";
      isValid = false;
    }

    if ($("#genre").val().length === 0) {
      errorMessage += "At least one genre should be selected.<br>";
      isValid = false;
    }

    if ($("#imageUpload").get(0).files.length === 0) {
      errorMessage += "Thumbnail image is required.<br>";
      isValid = false;
    }

    if (!isValid) {
      $("#error-message").html(errorMessage).show();
      e.preventDefault();
    } else {
      $("#error-message").hide();
    }
  });

  $("#updateMovieForm").on("submit", function (e) {
    var isValid = true;
    var errorMessage = "";

    if ($("#movieName").val().trim() === "") {
      errorMessage += "Title is required.<br>";
      isValid = false;
    }
    try {
      checkName($("#director").val().trim(), "director");
    } catch (error) {
      errorMessage += "format of director is wrong.<br>";
      isValid = false;
    }
    try {
      const actorsInput = $("#actors").val().trim();
      if (actorsInput === "") throw "actors must exist";
      const actors = actorsInput.split(",")?.map((e) => {
        return checkName(e.trim(), e);
      });
    } catch (error) {
      errorMessage += "format of actors is wrong.<br>";
      isValid = false;
    }
    try {
      const writer = $("#writer").val().trim();
      if (writer !== "") checkName(writer, "writer");
    } catch (error) {
      errorMessage += "format of writer is wrong.<br>";
      isValid = false;
    }
    try {
      checkName($("#producer").val().trim(), "producer");
    } catch (error) {
      errorMessage += "format of producer is wrong.<br>";
      isValid = false;
    }
    try {
      checkDate($("#releaseDate").val().trim(), "Release Date");
    } catch (error) {
      errorMessage += "releaseDate is invalid.<br>";
      isValid = false;
    }

    if ($("#genre").val().length === 0) {
      errorMessage += "At least one genre should be selected.<br>";
      isValid = false;
    }

    if ($("#imageUpload").get(0).files.length === 0) {
      errorMessage += "Thumbnail image is required.<br>";
      isValid = false;
    }

    if (!isValid) {
      $("#error-message").html(errorMessage).show();
      e.preventDefault();
    } else {
      $("#error-message").hide();
    }
  });
});

$(document).ready(function () {
  $(".delete-button").click(function (e) {
    e.preventDefault();
    const movieId = $(this).data("movieid");
    $.ajax({
      url: "/admin/" + movieId,
      type: "DELETE",
      success: function (result) {
        console.log("Movie deleted successfully");
        window.location.reload();
      },
      error: function (error) {
        console.error("Error deleting movie:", error);
      },
    });
  });
});

$(document).ready(function () {
  $(".deleteFlaggedReview-button").click(function (e) {
    e.preventDefault();
    const reviewId = $(this).data("reviewId");
    $.ajax({
      url: "/admin/flaggedReviews/" + reviewId,
      type: "DELETE",
      success: function (result) {
        console.log("Review deleted successfully");
        window.location.reload();
      },
      error: function (error) {
        console.error("Error deleting review:", error);
      },
    });
  });
});
