// JavaScript for Dwarka Sector 10 Restro Frontend

document.addEventListener("DOMContentLoaded", () => {
  // Video Handling in Carousel
  const carousel = document.querySelector("#specialOffersCarousel");
  const carouselItems = document.querySelectorAll(".carousel-item video");

  // Pause other videos when one is playing
  carousel.addEventListener("slide.bs.carousel", (event) => {
    carouselItems.forEach((video) => video.pause());
    const activeVideo = event.relatedTarget.querySelector("video");
    if (activeVideo) {
      activeVideo.play();
    }
  });

  // Play first video on load
  if (carouselItems[0]) {
    carouselItems[0].play();
  }

  // Smooth Scroll to Section
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth"
      });
    });
  });

  // Highlight Active Nav Link
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  function activateNavLink() {
    let currentSection = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 60) {
        currentSection = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(currentSection)) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", activateNavLink);

  // Adding Parallax Effect to Carousel Text
  window.addEventListener("scroll", () => {
    const overlayText = document.querySelectorAll(".text-overlay");
    overlayText.forEach(text => {
      const scrollPosition = window.scrollY;
      text.style.transform = `translateY(${scrollPosition * 0.3}px)`;
    });
  });

  // Add Fading Effect to Customer Reviews on Scroll
  const compliments = document.querySelectorAll(".compliments");
  const observerOptions = {
    threshold: 0.3,
  };
  const fadeInOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  };
  const observer = new IntersectionObserver(fadeInOnScroll, observerOptions);
  compliments.forEach(compliment => {
    observer.observe(compliment);
  });
});

// CSS class for fade-in effect
const style = document.createElement("style");
style.innerHTML = `
  .fade-in {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  .compliments {
    opacity: 0;
    transform: translateY(20px);
  }
`;
document.head.appendChild(style);
