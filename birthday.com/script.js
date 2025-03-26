document.addEventListener('DOMContentLoaded', function() {
    const loginSection = document.getElementById('login-section');
    const surpriseSection = document.getElementById('surprise-section');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    
    // Create audio element for background music
    const bgMusic = new Audio('Ikaw at Ako - Moira & Jason (heartwarming fingerstyle guitar cover).mp3');
    bgMusic.loop = true;
    
    // Login functionality
    loginBtn.addEventListener('click', function() {
        checkPassword();
    });
    
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
    
    function checkPassword() {
        const enteredPassword = passwordInput.value.trim().toLowerCase();
        
        // Client-side validation first
        if (!enteredPassword) {
            errorMessage.textContent = "Please enter a password.";
            errorMessage.style.display = 'block';
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 3000);
            return;
        }
        
        // For testing purposes, allow direct login with correct password
        // This is a fallback in case the server request fails
        if (enteredPassword === "divina") {
            loginSection.style.display = 'none';
            surpriseSection.style.display = 'block';
            createHearts();
            // Play background music
            bgMusic.play().catch(e => console.log("Audio couldn't autoplay: ", e));
            
            // Start typing animation if it exists
            if (typeof startTypingAnimation === 'function') {
                startTypingAnimation();
            }
            return;
        }
        
        // Show error message
        errorMessage.textContent = "Incorrect password. Please try again.";
        errorMessage.style.display = 'block';
        passwordInput.value = '';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
    
    // Create floating hearts
    function createHearts() {
        const heartsContainer = document.querySelector('.hearts-container');
        if (!heartsContainer) return;
        
        const numberOfHearts = 30;
        
        for (let i = 0; i < numberOfHearts; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            
            // Random position
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            
            // Random size
            const size = Math.random() * 20 + 15;
            
            // Random animation duration
            const animationDuration = Math.random() * 3 + 2;
            
            // Random delay
            const animationDelay = Math.random() * 5;
            
            heart.style.left = `${left}%`;
            heart.style.top = `${top}%`;
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            heart.style.animation = `floatHeart ${animationDuration}s ease-in-out ${animationDelay}s infinite`;
            
            heartsContainer.appendChild(heart);
        }
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Pause the background music if it's playing
            bgMusic.pause();
            
            // Reset the password field
            passwordInput.value = '';
            
            // Hide the surprise section
            surpriseSection.style.display = 'none';
            
            // Show the login section
            loginSection.style.display = 'block';
        });
    }
});

// Photo gallery functionality
// Enhanced Gallery Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Gallery enhancement
    const photoGallery = document.getElementById('photo-gallery');
    const showPhotosBtn = document.getElementById('show-photos-btn');
    const closeGalleryBtn = document.getElementById('close-gallery-btn');
    
    // Create fullscreen view container
    const fullscreenView = document.createElement('div');
    fullscreenView.className = 'fullscreen-view';
    const fullscreenImage = document.createElement('img');
    fullscreenImage.className = 'fullscreen-image';
    fullscreenView.appendChild(fullscreenImage);
    document.body.appendChild(fullscreenView);
    
    // Create gallery controls
    const galleryControls = document.createElement('div');
    galleryControls.className = 'gallery-controls';
    galleryControls.innerHTML = `
        <button class="gallery-control-btn" id="shuffle-gallery"><i class="fas fa-random"></i> Shuffle</button>
        <button class="gallery-control-btn" id="slideshow-gallery"><i class="fas fa-play"></i> Slideshow</button>
    `;
    
    // Add gallery controls to the gallery
    if (photoGallery) {
        photoGallery.appendChild(galleryControls);
    }
    
    // Show gallery
    if (showPhotosBtn) {
        showPhotosBtn.addEventListener('click', function() {
            photoGallery.style.display = 'flex';
            animateGalleryItems();
        });
    }
    
    // Close gallery
    if (closeGalleryBtn) {
        closeGalleryBtn.addEventListener('click', function() {
            photoGallery.style.display = 'none';
            stopSlideshow();
        });
    }
    
    // Animate gallery items
    function animateGalleryItems() {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            item.style.setProperty('--i', index);
        });
    }
    
    // Close gallery when clicking outside of images
    photoGallery.addEventListener('click', function(e) {
        if (e.target === photoGallery) {
            photoGallery.style.display = 'none';
            stopSlideshow();
        }
    });
    
    // Fullscreen image view
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            fullscreenImage.src = imgSrc;
            fullscreenView.style.display = 'flex';
        });
    });
    
    // Close fullscreen view
    fullscreenView.addEventListener('click', function() {
        this.style.display = 'none';
    });
    
    // Shuffle gallery
    const shuffleBtn = document.getElementById('shuffle-gallery');
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', function() {
            const galleryGrid = document.querySelector('.gallery-grid');
            const items = Array.from(galleryGrid.children);
            
            // Shuffle array
            for (let i = items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [items[i], items[j]] = [items[j], items[i]];
            }
            
            // Append shuffled items
            items.forEach(item => {
                galleryGrid.appendChild(item);
            });
            
            // Re-animate
            animateGalleryItems();
        });
    }
    
    // Slideshow functionality
    let slideshowInterval;
    let isPlaying = false;
    
    const slideshowBtn = document.getElementById('slideshow-gallery');
    if (slideshowBtn) {
        slideshowBtn.addEventListener('click', function() {
            if (!isPlaying) {
                // Start slideshow
                isPlaying = true;
                this.innerHTML = '<i class="fas fa-pause"></i> Pause';
                
                let currentIndex = 0;
                const items = document.querySelectorAll('.gallery-item');
                
                // Show first image in fullscreen
                fullscreenImage.src = items[currentIndex].querySelector('img').src;
                fullscreenView.style.display = 'flex';
                
                // Change image every 3 seconds
                slideshowInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % items.length;
                    
                    // Animate image change
                    fullscreenImage.style.opacity = '0';
                    setTimeout(() => {
                        fullscreenImage.src = items[currentIndex].querySelector('img').src;
                        fullscreenImage.style.opacity = '1';
                    }, 300);
                }, 3000);
            } else {
                // Stop slideshow
                stopSlideshow();
                this.innerHTML = '<i class="fas fa-play"></i> Slideshow';
            }
        });
    }
    
    function stopSlideshow() {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            isPlaying = false;
            fullscreenView.style.display = 'none';
            const playBtn = document.getElementById('slideshow-gallery');
            if (playBtn) {
                playBtn.innerHTML = '<i class="fas fa-play"></i> Slideshow';
            }
        }
    }
    
    // Close slideshow when closing fullscreen view
    fullscreenView.addEventListener('click', function() {
        stopSlideshow();
    });
});
    // Add animation to gallery images
    function animateGalleryImages() {
        const images = document.querySelectorAll('.gallery-img');
        images.forEach((img, index) => {
            img.style.animationDelay = `${index * 0.2}s`;
        });
    }


// Add this to your existing script.js file
document.addEventListener('DOMContentLoaded', function() {
    // Create logout message element
    const logoutMessage = document.createElement('div');
    logoutMessage.className = 'logout-message';
    logoutMessage.innerHTML = `
       
    `;
    document.body.appendChild(logoutMessage);
    
    // Find the existing logout button code and replace it with this enhanced version
    document.addEventListener('DOMContentLoaded', function() {
        // Get the logout button
        const logoutBtn = document.getElementById('logout-btn');
        
        // Create a new enhanced logout button
        if (logoutBtn) {
            // Update the existing button with new classes and content
            logoutBtn.className = 'enhanced-logout-btn';
            logoutBtn.innerHTML = `
                <span class="logout-icon"><i class="fas fa-heart-broken"></i></span>
                <span class="logout-text">Leave Our Special Moment</span>
                <span class="logout-hover-effect"></span>
            `;
            
            // Add event listener for hover effects
            logoutBtn.addEventListener('mouseenter', function() {
                this.classList.add('logout-hover');
            });
            
            logoutBtn.addEventListener('mouseleave', function() {
                this.classList.remove('logout-hover');
            });
            
            // Keep the existing click functionality
            logoutBtn.addEventListener('click', function() {
                // Create and show a beautiful goodbye message
                const goodbyeMessage = document.createElement('div');
                goodbyeMessage.className = 'goodbye-message';
                goodbyeMessage.innerHTML = `
                    <div class="goodbye-content">
                        <div class="goodbye-hearts"></div>
                        <h3>Goodbye My Love</h3>
                        <p>Thank you for sharing this special moment with me.</p>
                        <p>I love you! ❤️</p>
                    </div>
                `;
                document.body.appendChild(goodbyeMessage);
                
                // Animate the goodbye message
                setTimeout(() => {
                    goodbyeMessage.classList.add('show');
                }, 10);
                
                // Pause the background music if it's playing
                const bgMusic = document.querySelector('audio');
                if (bgMusic) {
                    bgMusic.pause();
                }
                
                // Hide the message and return to login after 3 seconds
                setTimeout(() => {
                    goodbyeMessage.classList.remove('show');
                    
                    setTimeout(() => {
                        // Remove the goodbye message
                        document.body.removeChild(goodbyeMessage);
                        
                        // Reset the password field
                        document.getElementById('password').value = '';
                        
                        // Hide the surprise section
                        document.getElementById('surprise-section').style.display = 'none';
                        
                        // Show the login section
                        document.getElementById('login-section').style.display = 'block';
                    }, 500);
                }, 3000);
            });
        }
    });
    
    // Close button for logout message
    document.getElementById('close-logout-message').addEventListener('click', function() {
        logoutMessage.style.display = 'none';
        
        // Reset the password field
        document.getElementById('password').value = '';
        
        // Hide the surprise section
        document.getElementById('surprise-section').style.display = 'none';
        
        // Show the login section
        document.getElementById('login-section').style.display = 'block';
    });
});

// Slideshow functionality
let slideIndex = 1;

// When the gallery is opened, show the first slide
document.getElementById('show-photos-btn').addEventListener('click', function() {
    document.getElementById('photo-gallery').style.display = 'flex';
    showSlides(slideIndex);
});

// Close gallery button
document.getElementById('close-gallery-btn').addEventListener('click', function() {
    document.getElementById('photo-gallery').style.display = 'none';
});

// Next/previous controls
function changeSlide(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    
    // Loop back to first slide if we go past the end
    if (n > slides.length) {slideIndex = 1}
    
    // Go to last slide if we go before the first
    if (n < 1) {slideIndex = slides.length}
    
    // Hide all slides
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    // Remove active class from all dots
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    // Show the current slide and activate its dot
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}

// Auto advance slides every 5 seconds when gallery is open
let slideInterval;

function startSlideshow() {
    slideInterval = setInterval(function() {
        changeSlide(1);
    }, 5000);
}

function stopSlideshow() {
    clearInterval(slideInterval);
}

// Start slideshow when gallery opens
document.getElementById('show-photos-btn').addEventListener('click', function() {
    startSlideshow();
});

// Stop slideshow when gallery closes
document.getElementById('close-gallery-btn').addEventListener('click', function() {
    stopSlideshow();
});

// Pause slideshow when user interacts with controls
document.querySelectorAll('.prev, .next, .dot').forEach(item => {
    item.addEventListener('click', function() {
        stopSlideshow();
        // Restart slideshow after 10 seconds of inactivity
        setTimeout(startSlideshow, 10000);
    });
});
// Typing animation for birthday message
const staticContent = document.getElementById('static-content');
const typingText = document.getElementById('typing-text');

// Function to start typing animation when surprise section is shown
function startTypingAnimation() {
    if (!staticContent || !typingText) return;
    
    const paragraphs = staticContent.getElementsByTagName('p');
    let allText = [];
    
    // Get all paragraphs
    for (let i = 0; i < paragraphs.length; i++) {
        allText.push(paragraphs[i].innerHTML);
    }
    
    // Create cursor element
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    typingText.appendChild(cursor);
    
    let currentParagraph = 0;
    let currentChar = 0;
    let currentParagraphElement = document.createElement('p');
    typingText.insertBefore(currentParagraphElement, cursor);
    
    // Type one character at a time
    function typeNextChar() {
        if (currentParagraph < allText.length) {
            if (currentChar < allText[currentParagraph].length) {
                currentParagraphElement.innerHTML += allText[currentParagraph].charAt(currentChar);
                currentChar++;
                setTimeout(typeNextChar, 50); // Adjust typing speed here
            } else {
                // Move to next paragraph
                currentParagraph++;
                currentChar = 0;
                
                if (currentParagraph < allText.length) {
                    // Check if it's a signature paragraph
                    const isSignature = allText[currentParagraph].includes('With all my love') || 
                                       allText[currentParagraph].includes('Your love') ||
                                       allText[currentParagraph].includes('Bryan');
                    
                    currentParagraphElement = document.createElement('p');
                    if (isSignature) {
                        currentParagraphElement.className = 'signature';
                    }
                    typingText.insertBefore(currentParagraphElement, cursor);
                    
                    // Small delay between paragraphs
                    setTimeout(typeNextChar, 500);
                } else {
                    // All done, remove cursor
                    setTimeout(() => {
                        cursor.style.display = 'none';
                        // Show the button after typing is complete
                        document.querySelector('.button-container').style.opacity = '1';
                    }, 1000);
                }
            }
        }
    }
    
    // Hide button until typing is complete
    document.querySelector('.button-container').style.opacity = '0';
    document.querySelector('.button-container').style.transition = 'opacity 1s';
    
    // Start typing
    setTimeout(typeNextChar, 1000);
}

// Check if we need to modify the existing event listener or add a new one
const checkPasswordOriginal = checkPassword;

// Override the checkPassword function to add typing animation
window.checkPassword = function() {
    const result = checkPasswordOriginal.apply(this, arguments);
    
    // If login was successful, start typing animation
    if (document.getElementById('surprise-section').style.display === 'block') {
        startTypingAnimation();
    }
    
    return result;
};
