// On attend que le DOM soit complètement chargé
document.addEventListener("DOMContentLoaded", () => {
    let currentSlide = 1;
    const totalSlides = 13;
    let isAnimating = false;

    // Initialisation : on cache toutes les slides sauf la première
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        if (index === 0) {
            gsap.set(slide, { display: "flex", opacity: 1 });
            slide.classList.add('active');
        } else {
            gsap.set(slide, { display: "none", opacity: 0 });
            slide.classList.remove('active');
        }
    });

    function updateSlide(direction) {
        if (isAnimating) return;
        isAnimating = true;

        const oldSlide = document.querySelector('.slide.active');
        const newSlide = document.getElementById(`slide-${currentSlide}`);

        if (!oldSlide || !newSlide) {
            isAnimating = false;
            return;
        }

        // 1. Sortie de l'ancienne slide
        gsap.to(oldSlide, {
            opacity: 0,
            y: direction === 'next' ? -80 : 80,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
                oldSlide.classList.remove('active');
                oldSlide.style.display = 'none';

                // 2. Entrée de la nouvelle slide
                newSlide.style.display = 'flex';
                newSlide.classList.add('active');
                
                // Animation de la nouvelle slide
                gsap.fromTo(newSlide, 
                    { opacity: 0, y: direction === 'next' ? 80 : -80 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.6, 
                        ease: "power2.out",
                        onComplete: () => { isAnimating = false; }
                    }
                );

                // 3. Animation des éléments internes (Stagger)
                const elements = newSlide.querySelectorAll('h1, h2, .glass-card, .diag-row, li, .step-item');
                if (elements.length > 0) {
                    gsap.fromTo(elements, 
                        { opacity: 0, y: 20, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.08, ease: "back.out(1.2)", delay: 0.1 }
                    );
                }
            }
        });

        // Mise à jour de la pagination
        updateUI();
    }

    function updateUI() {
        const indicator = document.querySelector('.page-indicator');
        if (indicator) indicator.innerText = `${currentSlide} / ${totalSlides}`;
        
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide - 1);
        });
    }

    // Fonctions globales pour les boutons (liées au window pour le onclick du HTML)
    window.nextSlide = () => {
        if (currentSlide < totalSlides && !isAnimating) {
            currentSlide++;
            updateSlide('next');
        }
    };

    window.prevSlide = () => {
        if (currentSlide > 1 && !isAnimating) {
            currentSlide--;
            updateSlide('prev');
        }
    };

    // Animation d'accueil au lancement
    const firstCard = document.querySelector('#slide-1 .glass-card');
    if (firstCard) {
        gsap.from(firstCard, { scale: 0.8, opacity: 0, duration: 1.2, ease: "elastic.out(1, 0.5)" });
    }
});