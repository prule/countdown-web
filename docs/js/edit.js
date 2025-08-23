/**
 * This script enables in-place editing for countdown components.
 * It only activates if the 'edit=true' URL parameter is present.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Check if we are in edit mode. If not, do nothing.
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('edit') !== 'true') {
    return;
  }

  console.log('Countdown Edit Mode Activated.');

  const titleElement = document.getElementById('countdown-title');
  const dateElement = document.getElementById('countdown-suffix');
  const timezoneElement = document.getElementById('countdown-timezone');

  if (titleElement) {
    makeEditable(titleElement, 'title', 'Edit Title', 'Enter a new title:');
  }

  if (dateElement) {
    makeEditable(dateElement, 'date', 'Edit Date', 'Select a new date and time:');
  }

  if (timezoneElement) {
    makeEditable(timezoneElement, 'timezone', 'Select Timezone', 'Select a timezone from the list:');
  }
});

/**
 * Makes a DOM element editable on click by showing a Bootstrap modal.
 * @param {HTMLElement} element The element to make editable.
 * @param {string} paramName The name of the URL parameter to update.
 * @param {string} modalTitle The title for the edit modal.
 * @param {string} labelText The label for the input field inside the modal.
 */
function makeEditable(element, paramName, modalTitle, labelText) {
  element.classList.add('editable');

  element.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const currentValue = element.textContent.trim();
    if (paramName === 'timezone') {
      showTimezoneModal(modalTitle, labelText);
    } else {
      showEditModal(paramName, modalTitle, labelText, currentValue);
    }
  });
}

/**
 * Creates and shows a Bootstrap modal for editing a value.
 * @param {string} paramName The URL parameter to update.
 * @param {string} modalTitle The title for the modal window.
 * @param {string} labelText The text for the input field's label.
 * @param {string} currentValue The current value to pre-fill the input with.
 */
function showEditModal(paramName, modalTitle, labelText, currentValue) {
  const existingModal = document.getElementById('edit-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Use a 'datetime-local' input for dates, and 'text' for others.
  const inputType = paramName === 'date' ? 'datetime-local' : 'text';
  const urlParams = new URLSearchParams(window.location.search);
  // For date editing, we need the full date string from the URL, not the displayed one.
  const fullDateFromUrl = urlParams.get('date') || '';
  let valueForInput = paramName === 'date' ? fullDateFromUrl : currentValue;

  if (paramName === 'date') {
    // The input type="datetime-local" requires a value in "YYYY-MM-DDTHH:MM" format.
    // We strip any timezone info for the input.
    const tzOffsetRegex = /([Zz]|([+-])(\d{2}):?(\d{2})?)$/;
    const dateWithoutTz = fullDateFromUrl.replace(tzOffsetRegex, '');

    // We convert our "YYYY-MM-DD HH:MM:SS" string to "YYYY-MM-DDTHH:MM"
    valueForInput = dateWithoutTz.replace(' ', 'T').substring(0, 16);
  }

  // Create modal HTML structure with a dark theme to match the site
  const modalHtml = `
    <div class="modal fade" id="edit-modal" tabindex="-1" aria-labelledby="edit-modal-label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-bg-dark">
          <div class="modal-header">
            <h5 class="modal-title" id="edit-modal-label">${modalTitle}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="edit-form" novalidate>
              <div class="mb-3">
                <label for="modal-input" class="form-label">${labelText}</label>
                <input type="${inputType}" class="form-control" id="modal-input" value="${valueForInput}">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="save-changes-btn">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add modal to the placeholder and initialize it
  document.getElementById('edit-modal-placeholder').innerHTML = modalHtml;
  const modalElement = document.getElementById('edit-modal');
  const modal = new bootstrap.Modal(modalElement);

  // Function to handle saving the new value
  const saveChanges = () => {
    const newValue = document.getElementById('modal-input').value;
    const url = new URL(window.location.href);

    // Compare against the original value formatted for the input to see if a change was made.
    if (newValue !== null && newValue.trim() !== valueForInput) {
      let finalValue = newValue.trim();

      if (paramName === 'date') {
        // Find original timezone offset from the full date string
        const tzOffsetRegex = /([Zz]|([+-])(\d{2}):?(\d{2})?)$/;
        const match = fullDateFromUrl.match(tzOffsetRegex);
        const originalOffset = match ? match[0] : '';

        // Re-attach original offset and add seconds to match the app's required format
        finalValue = `${newValue.trim()}:00${originalOffset}`;
      }

      url.searchParams.set(paramName, finalValue);
      window.location.href = url.toString();
    } else {
      modal.hide(); // Hide modal if no change was made
    }
  };

  // Handle save button click
  document.getElementById('save-changes-btn').addEventListener('click', saveChanges);

  // Handle form submission via Enter key
  document.getElementById('edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveChanges();
  });

  // Clean up the modal from the DOM after it's hidden to keep things tidy
  modalElement.addEventListener('hidden.bs.modal', () => {
    modalElement.remove();
  });

  modal.show();
}

/**
 * Creates and shows a Bootstrap modal for selecting a timezone.
 * @param {string} modalTitle The title for the modal window.
 * @param {string} labelText The text for the input field's label.
 */
function showTimezoneModal(modalTitle, labelText) {
  // Assumes `timezones` variable is available from `timezones.js`
    const timezones = Intl.supportedValuesOf('timeZone')

  if (typeof timezones === 'undefined') {
    console.error('Timezones data is not available. Make sure timezones.js is loaded.');
    return;
  }

  const existingModal = document.getElementById('edit-modal');
  if (existingModal) existingModal.remove();

  const modalHtml = `
    <div class="modal fade" id="edit-modal" tabindex="-1" aria-labelledby="edit-modal-label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content text-bg-dark">
          <div class="modal-header">
            <h5 class="modal-title" id="edit-modal-label">${modalTitle}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>${labelText}</p>
            <input id="timezone-filter" type="text" class="form-control bg-dark text-white mb-3" placeholder="Type to filter...">
            <ul id="timezone-list" class="list-group">
              <!-- Timezones will be populated here by JS -->
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('edit-modal-placeholder').innerHTML = modalHtml;
  const modalElement = document.getElementById('edit-modal');
  const modal = new bootstrap.Modal(modalElement);
  const timezoneList = document.getElementById('timezone-list');
  const filterInput = document.getElementById('timezone-filter');

  const populateTimezoneList = (filter = '') => {
    timezoneList.innerHTML = '';
    const filteredTimezones = timezones.filter(tz => tz.toLowerCase().includes(filter.toLowerCase().replace(' ', '_')));

    // Add a "Viewer's Local Time" option
    const localTimeLi = document.createElement('li');
    localTimeLi.className = 'list-group-item list-group-item-action bg-dark text-white';
    localTimeLi.textContent = "Viewer's Local Time";
    localTimeLi.style.cursor = 'pointer';
    localTimeLi.addEventListener('click', () => {
      const url = new URL(window.location.href);
      const dateParam = url.searchParams.get('date') || '';
      const tzOffsetRegex = /([Zz]|([+-])(\d{2}):?(\d{2})?)$/;
      // Remove any timezone offset from the date to make it local
      url.searchParams.set('date', dateParam.replace(tzOffsetRegex, ''));
      window.location.href = url.toString();
    });
    timezoneList.appendChild(localTimeLi);

    filteredTimezones.forEach(tzName => {
      const li = document.createElement('li');
      li.className = 'list-group-item list-group-item-action bg-dark text-white';
      li.textContent = tzName.replace(/_/g, ' ');
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        const url = new URL(window.location.href);
        const dateParam = url.searchParams.get('date') || new Date().toISOString();
        const tzOffsetRegex = /([Zz]|([+-])(\d{2}):?(\d{2})?)$/;
        const dateWithoutTz = dateParam.replace(tzOffsetRegex, '');

        // Calculate the offset string (e.g., "-04:00") for the selected timezone
        const now = new Date();
        const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(now.toLocaleString('en-US', { timeZone: tzName }));
        const diff = (tzDate.getTime() - utcDate.getTime()) / 60000;
        const hours = Math.floor(Math.abs(diff) / 60);
        const minutes = Math.abs(diff) % 60;
        const sign = diff < 0 ? "-" : "+";
        const offsetString = `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        url.searchParams.set('date', `${dateWithoutTz}${offsetString}`);
        window.location.href = url.toString();
      });
      timezoneList.appendChild(li);
    });
  };

  filterInput.addEventListener('input', () => populateTimezoneList(filterInput.value));

  modalElement.addEventListener('hidden.bs.modal', () => modalElement.remove());

  populateTimezoneList();
  modal.show();
}
