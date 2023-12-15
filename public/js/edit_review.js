//this form will edit the review
console.log("i have enteerd the form to edit the review");
const editButton = document.querySelectorAll('.editReview');
const modal = document.getElementById('editModal');
const closeButton = document.querySelector('.close');

editButton.forEach(button   =>  {
    button.addEventListener('click', () =>  {
        // alert('clicked!');
        modal.style.display = 'block';
        const existingRating = button.dataset.rating;
        const existingReview= button.dataset.review;

        document.getElementById('editedReview').value = existingReview;
        document.getElementById('editedRating').value = existingRating;
    });
});

function openModal()    {
    modal.style.display = 'block';
}
function closeModal()   {
    modal.style.display = 'none';
}

window.addEventListener('click', (event)    =>  {
    if(event.target == modal)   {
        modal.style.display = 'none';
    }
});

closeButton.addEventListener('click', ()    =>  {
    closeModal();
});