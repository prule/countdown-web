const urlParams = new URLSearchParams(window.location.search);
const targetDate = urlParams.get('date') || '1999-12-31T23:59:59';
const title = urlParams.get('title') || 'Countdown';
const image = urlParams.get('image') || 'clock';
const unsplash = urlParams.get('unsplash');
const font = urlParams.get('font') || 'lcd14';
const effect = urlParams.get('effect') || 'gradient';

/**
 * Calculates the time remaining until a target date
 * @param {string|Date} targetDate - The target date as a Date object or ISO string
 * @return {Object} Object containing days, hours, minutes, seconds, and total seconds remaining
 */
function calculateTimeRemaining(targetDate) {
  // Convert target date to Date object if it's a string
  const targetTime = targetDate instanceof Date ? targetDate : new Date(targetDate);
  const currentTime = new Date();

  // Calculate the time difference in milliseconds
  let timeDiff = targetTime - currentTime;

  // If the date is in the past, return zeros
  if (timeDiff < 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0
    };
  }

  // Convert milliseconds to seconds
  const totalSeconds = Math.floor(timeDiff / 1000);

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds
  };
}

/**
 * Formats the time remaining as a string (HH:MM:SS)
 * @param {Object} timeRemaining - Object containing time components
 * @param {boolean} includeDays - Whether to include days in the output
 * @return {Object} Formatted time string
 */
function formatTimeRemaining(timeRemaining, includeDays = false) {
  const { days, hours, minutes, seconds } = timeRemaining;

  // Pad numbers with leading zeros
  const pad = (num) => num.toString().padStart(2, '0');

  // If we've reached the target date
  if (timeRemaining.totalSeconds <= 0) {
    return {
      days: '',
      time: '00:00:00'
    }
  }

  if (includeDays && days > 0) {
    return {
      days: `${days} days`,
      time: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    }
  } else {
    // Convert days to hours if not including days separately
    const totalHours = includeDays ? hours : days * 24 + hours;
    return {
      days: '',
      time: `${pad(totalHours)}:${pad(minutes)}:${pad(seconds)}`
    }
  }
}

/**
 * Updates the countdown display
 * @param {string} targetDate - The target date as an ISO string
 * @param {string} elementId - The ID of the element to update
 */
function updateCountdown(targetDate, font, elementId = 'countdown') {
  const countdownElement = document.getElementById(elementId);
  if (!countdownElement) return;

  // Calculate time remaining
  const timeRemaining = calculateTimeRemaining(targetDate);

  // Format the time remaining
  const formattedTime = formatTimeRemaining(timeRemaining, true);

  // Update the element
  const daysElement = countdownElement.querySelector('.days');
  const timeElement = countdownElement.querySelector('.time');

  if (daysElement) {
    daysElement.textContent = formattedTime.days;
  }
  if (timeElement) {
    timeElement.textContent = formattedTime.time;
  }

  // Continue updating
  setTimeout(() => updateCountdown(targetDate, font, elementId), 1000);
}

/**
 * Initializes the countdown with a date from query parameter or default
 */
function initCountdownFromQuery() {

  const countdownElement = document.getElementById("countdown");
  if (!countdownElement) return;

  countdownElement.classList.add(`countdown-font-${font}`);
  countdownElement.classList.add(`countdown-effect-${effect}`);

  log(targetDate, title);

  // set document title
  document.title = title;

  if (unsplash) {
    document.body.style.backgroundImage = `url(https://images.unsplash.com/${unsplash})`;
  } else if (image) {
    document.body.style.backgroundImage = `url(./img/${image}.jpg)`;
  }
  // Start the countdown
  updateCountdown(targetDate, font);

  const countdownTitleElement = document.getElementById("countdown-title");
  countdownTitleElement.textContent = title;

  const countdownSuffixElement = document.getElementById("countdown-suffix");
  countdownSuffixElement.textContent = targetDate;
}

// Initialize the countdown when the DOM is loaded
document.addEventListener('DOMContentLoaded', initCountdownFromQuery);

if (new URLSearchParams(window.location.search).get('preview') === 'true') {
  document.getElementById('button-menu').style.display = 'none';
}

function log(x) {
  if (window.location.href.includes('localhost')) {
    console.log(x);
  }
}

const btn = document.getElementById('share-button');

btn.addEventListener("click", async () => {
  window.open("./share.html?link=" + encodeURIComponent(window.location.href), '_blank');
});
