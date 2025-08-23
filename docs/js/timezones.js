
/**
 * Format a timezone offset as hours (e.g., "+02:00" or "-05:30")
 * @param {string} timezone - The timezone identifier (e.g., "America/New_York")
 * @return {string} The formatted offset (e.g., "+02:00")
 */
function formatTimezoneOffsetAsHours(timezone) {
  // Create a date in the specified timezone
  const date = new Date();

  // Get the offset in minutes
  const offsetInMinutes = getTimezoneOffsetInMinutes(timezone, date);

  // Convert to hours and minutes
  const hours = Math.floor(Math.abs(offsetInMinutes) / 60);
  const minutes = Math.abs(offsetInMinutes) % 60;

  // Format with sign
  const sign = offsetInMinutes >= 0 ? '+' : '-';

  // Return formatted string (e.g., "+02:00" or "-05:30")
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Get the timezone offset in minutes for a specific timezone
 * @param {string} timezone - The timezone identifier
 * @param {Date} date - The date to check
 * @return {number} The offset in minutes
 */
function getTimezoneOffsetInMinutes(timezone, date) {
  // Format the date in UTC and in the target timezone
  const utcTime = date.toLocaleString('en-US', { timeZone: 'UTC' });
  const targetTime = date.toLocaleString('en-US', { timeZone: timezone });

  // Parse both times
  const utcDate = new Date(utcTime);
  const targetDate = new Date(targetTime);

  // Calculate the difference in minutes
  const offsetInMinutes = (targetDate - utcDate) / (60 * 1000);

  return offsetInMinutes;
}

function doFilter() {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // clear the list
  timezoneList.innerHTML = '<li class="list-group-item" data-offset="Viewers local timezone">Viewers local timezone</li>';

  const timezones = Intl.supportedValuesOf('timeZone')
  timezones.unshift(userTimeZone);

  let filter = (filterInput.value ?? "").toLowerCase();
  const zones= timezones.map(timezone => {
    const offset = formatTimezoneOffsetAsHours(timezone);
    const option = document.createElement('li');
    option.classList.add('list-group-item');
    // set data to offset
    option.dataset.offset = offset;

    option.textContent = `UTC${offset} ${timezone}`;
    if (option.textContent.toLowerCase().indexOf(filter) > -1) {
      return (option);
    }
    return null;
  })

  zones.forEach((option, idx) => {
      timezoneSelect.appendChild(option);
  })

  // add onclick to each option in timezoneSelect
  timezoneSelect.querySelectorAll('li').forEach(li => {
    li.onclick = function(e) {
      timezoneOffset.value = e.target.dataset.offset
      updatePreview();
    }
  })


}

const timezoneList = document.getElementById('timezone-list');
const timezoneSelect = document.getElementById('timezone-list');
const filterInput = document.getElementById('timezone-filter');
const timezoneOffset = document.getElementById('timezone-offset');


// Initialize the filter when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add event listener for input changes
  filterInput.addEventListener('input', function() {
    doFilter();
  });
});

doFilter();
