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

  if (titleElement) {
    makeEditable(titleElement, 'title', 'Edit Title', 'Enter a new title:');
  }

  if (dateElement) {
    makeEditable(dateElement, 'date', 'Edit Date', 'Select a new date and time:');
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
    showEditModal(paramName, modalTitle, labelText, currentValue);
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
  let valueForInput = currentValue;

  if (paramName === 'date') {
    // The input type="datetime-local" requires a value in "YYYY-MM-DDTHH:MM" format.
    // We convert our "YYYY-MM-DD HH:MM:SS" string to that format.
    valueForInput = currentValue.replace(' ', 'T').substring(0, 16);
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
    // Compare against the original value formatted for the input to see if a change was made.
    if (newValue !== null && newValue.trim() !== valueForInput) {
      const url = new URL(window.location.href);
      let finalValue = newValue.trim();

      if (paramName === 'date') {
        // Append seconds to match the format required by the app (YYYY-MM-DDTHH:MM:SS)
        finalValue = `${newValue.trim()}:00`;
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