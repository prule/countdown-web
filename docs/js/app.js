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
    const unsplashCredit = document.getElementById('unsplash-credit');
    if (unsplashCredit) {
      // Make the button visible since an Unsplash image is being used.
      unsplashCredit.style.display = 'inline-block';
    }
  } else if (image) {
    document.body.style.backgroundImage = `url(./img/${image}.jpg)`;
  }
  // Start the countdown
  updateCountdown(targetDate, font);

  const countdownTitleElement = document.getElementById('countdown-title');
  if (countdownTitleElement) {
    countdownTitleElement.textContent = title;
    // Add the shared text block class
    countdownTitleElement.classList.add('countdown-text-block');
  }

  const countdownSuffixElement = document.getElementById('countdown-suffix');
  if (countdownSuffixElement) {
    // Regex to find a timezone offset (e.g., +05:00, -0800, Z)
    const tzOffsetRegex = /([Zz]|([+-])(\d{2}):?(\d{2})?)$/;
    const match = targetDate.match(tzOffsetRegex);
    let displayDate = targetDate;
    let displayTimezone = "Viewer's Local Time";

    if (match) {
      // If there's a timezone, strip it for display and format it.
      displayDate = targetDate.substring(0, match.index);
      const offset = match[0].toUpperCase() === 'Z' ? 'UTC' : `UTC${match[0]}`;
      displayTimezone = `Timezone: ${offset}`;
    }

    // Display the date part, replacing 'T' with a space for readability
    countdownSuffixElement.textContent = displayDate.replace('T', ' ');

    const timezoneElement = document.getElementById('countdown-timezone');
    if (timezoneElement) timezoneElement.textContent = displayTimezone;
  }
}

// Initialize the countdown when the DOM is loaded
document.addEventListener('DOMContentLoaded', initCountdownFromQuery);

if (new URLSearchParams(window.location.search).get('preview') === 'true') {
  const buttonMenu = document.getElementById('button-menu');
  if (buttonMenu) {
    buttonMenu.style.display = 'none';
  }
}

function log(x) {
  if (window.location.href.includes('localhost')) {
    console.log(x);
  }
}

const shareButton = document.getElementById('share-button');
if (shareButton) {
  shareButton.addEventListener('click', () => {
    // Create a URL object to easily manipulate search parameters
    const url = new URL(window.location.href);

    // Remove the 'edit' parameter to create a clean, shareable link
    url.searchParams.delete('edit');

    const shareableLink = url.toString();

    // Use the modern clipboard API to copy the link
    navigator.clipboard.writeText(shareableLink).then(() => {
      // Provide non-blocking feedback to the user
      const originalText = shareButton.textContent;
      shareButton.textContent = 'Copied!';
      setTimeout(() => {
        shareButton.textContent = originalText;
      }, 2000); // Revert back after 2 seconds
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  });
}
