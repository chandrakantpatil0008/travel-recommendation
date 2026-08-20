/* ========================================
   Travel Explorer - Main JavaScript
   ======================================== */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // Mobile Navigation Toggle
    // ========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ========================================
    // Highlight Active Navigation Link
    // ========================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-link');

    allNavLinks.forEach(function (link) {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ========================================
    // Search Functionality
    // ========================================
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const searchResults = document.getElementById('searchResults');
    const destinationCards = document.querySelectorAll('.destination-card');
    const recommendationSections = document.querySelectorAll('.recommendation-section');

    // Search Button Click
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // Search on Enter key press
    if (searchInput) {
        searchInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Clear Button Click
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSearch);
    }

    // Perform Search Function
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query === '') {
            searchResults.innerHTML = '<div class="no-result">⚠️ Please enter a destination to search.</div>';
            return;
        }
        
        let matchCount = 0;
        
        // Filter destination cards
        destinationCards.forEach(function (card) {
            const cardSearch = card.getAttribute('data-search').toLowerCase();
            const cardTitle = card.querySelector('.card-title').textContent.toLowerCase();
            const cardLocation = card.querySelector('.card-location').textContent.toLowerCase();
            const cardDescription = card.querySelector('.card-description').textContent.toLowerCase();
            
            if (cardSearch.includes(query) || 
                cardTitle.includes(query) || 
                cardLocation.includes(query) ||
                cardDescription.includes(query)) {
                card.classList.remove('hidden');
                matchCount++;
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Hide entire sections if all cards in them are hidden
        recommendationSections.forEach(function (section) {
            const visibleCards = section.querySelectorAll('.destination-card:not(.hidden)');
            if (visibleCards.length === 0) {
                section.classList.add('all-hidden');
            } else {
                section.classList.remove('all-hidden');
            }
        });
        
        // Show results message
        if (matchCount > 0) {
            searchResults.innerHTML = `<div class="result-message">✅ Found ${matchCount} destination(s) matching "${searchInput.value}".</div>`;
            
            // Scroll to first visible section
            const firstVisibleSection = document.querySelector('.recommendation-section:not(.all-hidden)');
            if (firstVisibleSection) {
                firstVisibleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            searchResults.innerHTML = `<div class="no-result">❌ No destinations found for "${searchInput.value}".</div>`;
        }
    }

    // Clear Search Function
    function clearSearch() {
        searchInput.value = '';
        searchResults.innerHTML = '';
        
        // Show all destination cards
        destinationCards.forEach(function (card) {
            card.classList.remove('hidden');
        });
        
        // Show all sections
        recommendationSections.forEach(function (section) {
            section.classList.remove('all-hidden');
        });
        
        // Focus back on search input
        if (searchInput) {
            searchInput.focus();
        }
    }

    // ========================================
    // Contact Form Validation
    // ========================================
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            // Prevent default form submission
            event.preventDefault();

            // Clear previous errors
            clearErrors();

            // Get form values
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            let isValid = true;

            // Validate Full Name
            if (fullName === '') {
                showError('fullName', 'nameError', 'Please enter your full name.');
                isValid = false;
            } else if (fullName.length < 2) {
                showError('fullName', 'nameError', 'Name must be at least 2 characters.');
                isValid = false;
            }

            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === '') {
                showError('email', 'emailError', 'Please enter your email address.');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                showError('email', 'emailError', 'Please enter a valid email address.');
                isValid = false;
            }

            // Validate Subject
            if (subject === '') {
                showError('subject', 'subjectError', 'Please enter a subject.');
                isValid = false;
            }

            // Validate Message
            if (message === '') {
                showError('message', 'messageError', 'Please enter your message.');
                isValid = false;
            } else if (message.length < 10) {
                showError('message', 'messageError', 'Message must be at least 10 characters.');
                isValid = false;
            }

            // If valid, show success message
            if (isValid) {
                contactForm.style.display = 'none';
                successMessage.classList.add('show');

                // Reset form fields
                contactForm.reset();

                // Hide success message after 5 seconds and show form again
                setTimeout(function () {
                    successMessage.classList.remove('show');
                    contactForm.style.display = 'block';
                }, 5000);

                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Helper function to show error
    function showError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (input) input.classList.add('error');
        if (error) error.textContent = message;
    }

    // Helper function to clear all errors
    function clearErrors() {
        const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
        const errors = document.querySelectorAll('.error-message');

        inputs.forEach(function (input) {
            input.classList.remove('error');
        });

        errors.forEach(function (error) {
            error.textContent = '';
        });
    }

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    event.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ========================================
    // Navbar Shadow on Scroll
    // ========================================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }
        });
    }

});