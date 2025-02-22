let slideIndex = {}; // Store slide index for each slideshow

function plusSlides(n, slideshowIndex) {
    if (!slideIndex[slideshowIndex]) {
        slideIndex[slideshowIndex] = 1;
    }
    showSlides(slideIndex[slideshowIndex] += n, slideshowIndex);
}

function showSlides(n, slideshowIndex) {
    let i;
    let slides = document.getElementById(`slideshow-${slideshowIndex}`).getElementsByClassName("mySlides");
    if (n > slides.length) {
        slideIndex[slideshowIndex] = 1
    }
    if (n < 1) {
        slideIndex[slideshowIndex] = slides.length
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    if (slides.length > 0) {
      slides[slideIndex[slideshowIndex] - 1].style.display = "block";
    }
}

propertyItems = document.querySelectorAll('.property-item');
propertyItems.forEach(item => {
    const index = item.getAttribute('data-index');
    showSlides(1, index); // Initialize each slideshow

    item.addEventListener('click', () => {
        const details = document.getElementById(`property-details-${index}`);
        document.querySelectorAll('.property-details').forEach(d => d.classList.remove('active'));
        details.classList.add('active');
    });
});