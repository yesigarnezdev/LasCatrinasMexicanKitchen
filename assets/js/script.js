document.addEventListener('DOMContentLoaded', () => {
    // Variables del Carrusel
    const track = document.getElementById('image-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');
    const carouselImages = document.querySelectorAll('.carousel-image');


    if(nextBtn && prevBtn && track) {
        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: 320, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -320, behavior: 'smooth' });
        });
    }


    carouselImages.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src; 
            lightbox.classList.add('active');
        });
    });

    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }

    if(lightbox) {
        lightbox.addEventListener('click', (e) => {
            if(e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }
});