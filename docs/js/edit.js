/**
 * This script enables in-place editing for countdown components.
 * It only activates if the 'edit=true' URL parameter is present.
 */
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isEditMode = urlParams.get('edit') === 'true';
  const createButton = document.getElementById('create-button');

  if (createButton) {
    // Repurpose the 'Create' button to be an 'Edit'/'View Mode' toggle.
    createButton.href = '#'; // Prevent navigation to builder.html
    createButton.removeAttribute('target');

    if (isEditMode) {
      createButton.textContent = 'View Mode';
      createButton.setAttribute('aria-label', 'Exit edit mode');
    } else {
      createButton.textContent = 'Edit';
      createButton.setAttribute('aria-label', 'Enter edit mode');
    }

    createButton.addEventListener('click', (e) => {
      e.preventDefault();
      const currentUrl = new URL(window.location.href);
      if (isEditMode) {
        currentUrl.searchParams.delete('edit');
      } else {
        currentUrl.searchParams.set('edit', 'true');
      }
      window.location.href = currentUrl.toString();
    });
  }

  // If we are not in edit mode, we don't need to set up the editable fields.
  if (!isEditMode) {
    return;
  }

  createEditBanner();

  console.log('Countdown Edit Mode Activated.');

  const titleElement = document.getElementById('countdown-title');
  const dateElement = document.getElementById('countdown-suffix');
  const timezoneElement = document.getElementById('countdown-timezone');
  const panelElement = document.querySelector('.countdown-panel');
  const countdownElement = document.getElementById('countdown');

  if (panelElement) {
    makeEditable(panelElement, 'background', 'Edit Background', 'Search for an image on Unsplash:');
  }

  if (titleElement) {
    makeEditable(titleElement, 'title', 'Edit Title', 'Enter a new title:');
  }

  if (dateElement) {
    makeEditable(dateElement, 'date', 'Edit Date', 'Select a new date and time:');
  }

  if (timezoneElement) {
    makeEditable(timezoneElement, 'timezone', 'Select Timezone', 'Select a timezone from the list:');
  }

  if (countdownElement) {
    makeEditable(countdownElement, 'display', 'Edit Display', 'Choose a font and effect:');
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
    if (paramName === 'background') {
      showUnsplashModal(modalTitle, labelText);
    } else if (paramName === 'timezone') {
      showTimezoneModal(modalTitle, labelText);
    } else if (paramName === 'display') {
      showDisplayModal(modalTitle, labelText);
    } else {
      showEditModal(paramName, modalTitle, labelText, currentValue);
    }
  });
}

/**
 * Creates and prepends an "Edit Mode" banner to the top of the page.
 */
function createEditBanner() {
  const banner = document.createElement('div');
  banner.id = 'edit-mode-banner';
  banner.innerHTML = `
    <span>You are in Edit Mode. Click an element with a dashed outline to change it.</span>
    <button type="button" class="close-banner-btn" aria-label="Close">&times;</button>
  `;
  document.body.prepend(banner);
  document.body.classList.add('edit-mode-active');

  // Set a CSS variable with the banner's height to adjust the fixed menu
  const bannerHeight = banner.offsetHeight;
  document.documentElement.style.setProperty('--edit-banner-height', `${bannerHeight}px`);

  // Add event listener to close button
  banner.querySelector('.close-banner-btn').addEventListener('click', () => {
    banner.style.display = 'none';
    document.body.classList.remove('edit-mode-active');
    // Reset the CSS variable so the menu returns to its original position
    document.documentElement.style.setProperty('--edit-banner-height', '0px');
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
 * Creates and shows a Bootstrap modal for editing the font and effect.
 * @param {string} modalTitle The title for the modal window.
 * @param {string} labelText The text for the input field's label.
 */
function showDisplayModal(modalTitle, labelText) {
  const existingModal = document.getElementById('edit-modal');
  if (existingModal) existingModal.remove();

  const urlParams = new URLSearchParams(window.location.search);
  const currentFont = urlParams.get('font') || 'lcd14';
  const currentEffect = urlParams.get('effect') || 'gradient';

  const modalHtml = `
    <div class="modal fade" id="edit-modal" tabindex="-1" aria-labelledby="edit-modal-label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-bg-dark">
          <div class="modal-header">
            <h5 class="modal-title" id="edit-modal-label">${modalTitle}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>${labelText}</p>
            <form id="edit-form" novalidate>
              <div class="mb-3">
                <label for="font-select" class="form-label">Font</label>
                <select id="font-select" class="form-select">
                  <option value="lcd14">LCD</option>
                  <option value="vt323">VT323</option>
                  <option value="poppins">Poppins</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="effect-select" class="form-label">Effect</label>
                <select id="effect-select" class="form-select">
                  <option value="gradient">Gradient</option>
                  <option value="neon-pulse">Neon Pulse</option>
                  <option value="matrix">Matrix</option>
                  <option value="fire">Fire</option>
                  <option value="hologram">Hologram</option>
                </select>
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

  document.getElementById('edit-modal-placeholder').innerHTML = modalHtml;
  const modalElement = document.getElementById('edit-modal');
  const modal = new bootstrap.Modal(modalElement);

  const fontSelect = document.getElementById('font-select');
  const effectSelect = document.getElementById('effect-select');
  fontSelect.value = currentFont;
  effectSelect.value = currentEffect;

  const saveChanges = () => {
    const newFont = fontSelect.value;
    const newEffect = effectSelect.value;

    if (newFont !== currentFont || newEffect !== currentEffect) {
      const url = new URL(window.location.href);
      url.searchParams.set('font', newFont);
      url.searchParams.set('effect', newEffect);
      window.location.href = url.toString();
    } else {
      modal.hide();
    }
  };

  document.getElementById('save-changes-btn').addEventListener('click', saveChanges);
  document.getElementById('edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveChanges();
  });

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
  // Use the browser's built-in list of timezones for accuracy and simplicity.
  const timezones = Intl.supportedValuesOf('timeZone');

  if (!timezones || timezones.length === 0) {
    console.error('Could not retrieve timezones from the browser.');
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

/**
 * Creates and shows a Bootstrap modal for searching Unsplash.
 * @param {string} modalTitle The title for the modal window.
 * @param {string} labelText The text for the input field's label.
 */
function showUnsplashModal(modalTitle, labelText) {
  const existingModal = document.getElementById('edit-modal');
  if (existingModal) existingModal.remove();

  let currentPage = 1;
  let currentQuery = '';
  let isLoading = false;

  const modalHtml = `
    <div class="modal fade" id="edit-modal" tabindex="-1" aria-labelledby="edit-modal-label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content text-bg-dark">
          <div class="modal-header">
            <h5 class="modal-title" id="edit-modal-label">${modalTitle}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>${labelText}</p>
            <div class="input-group mb-3">
              <input id="unsplash-search-input" type="text" class="form-control bg-dark text-white" placeholder="e.g., space, beach, fireworks">
              <button class="btn btn-primary" type="button" id="unsplash-search-btn">Search</button>
            </div>
            <div id="unsplash-results" class="unsplash-results-grid">
              <!-- Search results will be populated here -->
            </div>
            <div class="unsplash-loader-container">
              <button class="btn btn-outline-light" id="load-more-btn" style="display: none;">Load More</button>
              <div id="unsplash-loader" class="spinner-border text-light" role="status" style="display: none;">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('edit-modal-placeholder').innerHTML = modalHtml;
  const modalElement = document.getElementById('edit-modal');
  const modal = new bootstrap.Modal(modalElement);
  const searchInput = document.getElementById('unsplash-search-input');
  const searchButton = document.getElementById('unsplash-search-btn');
  const resultsContainer = document.getElementById('unsplash-results');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const loader = document.getElementById('unsplash-loader');

  const performSearch = async (isNewSearch = true) => {
    if (isLoading) return;

    if (isNewSearch) {
      const query = searchInput.value.trim();
      if (!query) return;
      currentPage = 1;
      currentQuery = query;
      resultsContainer.innerHTML = '';
    } else {
      currentPage++;
    }

    isLoading = true;
    loader.style.display = 'inline-block';
    loadMoreBtn.style.display = 'none';
    searchButton.disabled = true;

    try {
      const photos = await doGet(currentPage, currentQuery); // From unsplash.js

      if (photos && photos.length > 0) {
        photos.forEach(photo => {
          const imgContainer = document.createElement('div');
          imgContainer.className = 'unsplash-thumbnail';
          imgContainer.style.backgroundImage = `url(${photo.urls.thumb})`;
          imgContainer.setAttribute('aria-label', photo.alt_description || 'Unsplash image');
          imgContainer.addEventListener('click', () => {
            const url = new URL(window.location.href);
            url.searchParams.set('unsplash', photo.id);
            url.searchParams.delete('image'); // Remove local image param if it exists
            window.location.href = url.toString();
          });
          resultsContainer.appendChild(imgContainer);
        });
        // Show 'Load More' button only if we got a full page of results (12 is the per_page value)
        loadMoreBtn.style.display = photos.length < 12 ? 'none' : 'block';
      } else {
        loadMoreBtn.style.display = 'none';
        if (currentPage === 1) {
          resultsContainer.innerHTML = '<p class="text-muted text-center w-100">No results found.</p>';
        }
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
      if (currentPage === 1) {
        resultsContainer.innerHTML = '<p class="text-danger text-center w-100">Could not fetch photos. Please try again later.</p>';
      }
    } finally {
      isLoading = false;
      loader.style.display = 'none';
      searchButton.disabled = false;
    }
  };

  searchButton.addEventListener('click', () => performSearch(true));
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(true);
    }
  });
  loadMoreBtn.addEventListener('click', () => performSearch(false));

  modalElement.addEventListener('hidden.bs.modal', () => modalElement.remove());

  modal.show();
}
