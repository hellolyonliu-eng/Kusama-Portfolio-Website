// Parallax Zoom Scroll Effect
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  
  // Apply parallax zoom to circle-img elements
  const circleImgs = document.querySelectorAll('.circle-img.parallax-zoom');
  circleImgs.forEach(element => {
    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + scrollY;
    const distance = scrollY - (elementTop - window.innerHeight);
    const scale = 1 + (distance * 0.0003);
    const translateY = distance * 0.1;
    
    element.style.transform = `scale(${scale}) translateY(-${translateY}px)`;
  });

  // Apply parallax zoom to headings (h2, h3)
  const headings = document.querySelectorAll('h2.parallax-zoom, h3.parallax-zoom');
  headings.forEach(element => {
    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + scrollY;
    const distance = scrollY - (elementTop - window.innerHeight);
    const translateY = distance * 0.15;
    
    element.style.transform = `translateY(-${translateY}px)`;
  });

  // Apply parallax zoom to paragraphs
  const paragraphs = document.querySelectorAll('p.parallax-zoom');
  paragraphs.forEach(element => {
    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + scrollY;
    const distance = scrollY - (elementTop - window.innerHeight);
    const translateY = distance * 0.12;
    
    element.style.transform = `translateY(-${translateY}px)`;
  });
});

// Carousel Functionality
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const container = document.querySelector('.carousel-container');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const cards = document.querySelectorAll('.card');

  if (!track || !container || !prevBtn || !nextBtn || !cards.length) return;
  
  let currentIndex = 0;
  let cardWidth = 0;
  let visibleCards = 1;
  let maxIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function updateMeasurements() {
    if (!cards.length) return;
    const cardRect = cards[0].getBoundingClientRect();
    const cardStyle = window.getComputedStyle(cards[0]);
    const marginRight = parseFloat(cardStyle.marginRight) || 0;
    cardWidth = cardRect.width + marginRight;
    visibleCards = Math.max(1, Math.floor(container.clientWidth / cardWidth));
    maxIndex = Math.max(0, cards.length - visibleCards);
    if (currentIndex > maxIndex) currentIndex = maxIndex;
  }

  function updateCarousel() {
    // Keep cards left-aligned so no card content gets clipped at the container edges.
    const translateX = -currentIndex * cardWidth;
    track.style.transform = `translateX(${translateX}px)`;
  }

  updateMeasurements();
  updateCarousel();
  window.addEventListener('resize', () => {
    updateMeasurements();
    updateCarousel();
  });
  
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Swipe/Trackpad Support
  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  // Also support trackpad swipe (wheel event with shiftKey)
  container.addEventListener('wheel', (e) => {
    if (e.shiftKey || Math.abs(e.deltaY) < 10) {
      e.preventDefault();
      if (e.deltaX > 0 || e.deltaY > 0) {
        // Scroll right - go to next
        if (currentIndex < maxIndex) {
          currentIndex++;
          updateCarousel();
        }
      } else {
        // Scroll left - go to previous
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      }
    }
  }, { passive: false });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - go to next
        if (currentIndex < maxIndex) {
          currentIndex++;
          updateCarousel();
        }
      } else {
        // Swiped right - go to previous
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      }
    }
  }
});

// Scroll reveal for decade-layout
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.decade-layout, .biography-copy').forEach(el => revealObserver.observe(el));

// ── Cursor Trailing Dot ──
(function () {
  const dot = document.createElement('div');
  dot.className = 'cursor-trail-dot';
  document.body.appendChild(dot);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  function isReddish(colorValue) {
    if (!colorValue || colorValue === 'transparent') return false;
    const match = colorValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!match) return false;
    const r = Number(match[1]);
    const g = Number(match[2]);
    const b = Number(match[3]);
    return r >= 140 && g <= 90 && b <= 90;
  }

  function isOverRedElement(x, y) {
    let el = document.elementFromPoint(x, y);
    while (el && el !== document.body) {
      const styles = window.getComputedStyle(el);
      if (
        isReddish(styles.color) ||
        isReddish(styles.backgroundColor) ||
        isReddish(styles.borderTopColor)
      ) {
        return true;
      }
      el = el.parentElement;
    }
    return false;
  }

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    dot.style.opacity = '0.9';

    if (isOverRedElement(e.clientX, e.clientY)) {
      dot.classList.add('on-red');
    } else {
      dot.classList.remove('on-red');
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '0.9';
  });

  function animate() {
    currentX += (targetX - currentX) * 0.16;
    currentY += (targetY - currentY) * 0.16;
    dot.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  }

  animate();
})();

//section toggle for solo exhibitions
document.querySelectorAll('.decade-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.decade-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.decade-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.d).classList.add('active');
  });
});