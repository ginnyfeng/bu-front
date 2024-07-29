function debounce (func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const scrollArea = document.querySelector(".scrollArea"),
  content = scrollArea.querySelector(".content");

const scrollbar = scrollArea.querySelector(".scrollbar"),
  thumb = scrollbar.querySelector(".thumb");

let isDragging = false,
  startY,
  startThumbY;

/**
 * Calculates the initial thumb height based on content overflow. 
 * This is conventional for scrollbars because if the thumb was always 80px or whatever, we would have to drag a considerable amount to the bottom
 * only for it to move like 250px if the content is small.
 */
function initializeThumbHeight() {
  const contentOverflow = content.scrollHeight - scrollArea.clientHeight,
    overflowRatio = contentOverflow / content.scrollHeight,
    thumbHeight = `${100 - overflowRatio * 100}%`;

  thumb.style.height = thumbHeight;
}
window.onload = () => {
  requestAnimationFrame(initializeThumbHeight);
  window.addEventListener("resize", debounce(initializeThumbHeight, 1000));
};

function calculateDimensions() {
  const contentScrollHeight = content.scrollHeight - scrollArea.clientHeight,
    maxThumbY = scrollbar.clientHeight - thumb.clientHeight,
    scrollRatio = contentScrollHeight / maxThumbY;

  return { contentScrollHeight, maxThumbY, scrollRatio };
}

function updateContentPosition(scrollAmount) {
  const { contentScrollHeight, scrollRatio } = calculateDimensions()

  if (scrollRatio > 0) {
    const newScrollTop = Math.max(0, Math.min(scrollArea.scrollTop + scrollAmount, contentScrollHeight));
    const newThumbY = newScrollTop / scrollRatio;
    thumb.style.transform = `translateY(${newThumbY}px)`;

    const newContentY = -newThumbY * scrollRatio;
    content.style.transform = `translateY(${newContentY}px)`;
  }
}

thumb.addEventListener("mousedown", (e) => {
  isDragging = true;
  startY = e.clientY;
  startThumbY = thumb.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const dy = e.clientY - startY;
  const { maxThumbY, scrollRatio } = calculateDimensions();
  let newThumbY = startThumbY + dy;
  newThumbY = Math.max(0, Math.min(newThumbY, maxThumbY));

  if (scrollRatio > 0) {
    const newContentY = -newThumbY * scrollRatio;
    thumb.style.transform = `translateY(${newThumbY}px)`;
    content.style.transform = `translateY(${newContentY}px)`;
  }
});

document.addEventListener("mouseup", () => { isDragging = false });

// TODO: arrow keys.

// Handles scroll wheel.
scrollArea.addEventListener("wheel", (e) => {
  updateContentPosition(e.deltaY);
  e.preventDefault();
});