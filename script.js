// Array state
let array = [];
let animationSpeed = 500; // Medium speed by default
let operationHistory = [];

// DOM Elements
const arrayContainer = document.getElementById('arrayContainer');
const arrayLength = document.getElementById('arrayLength');
const operationStatus = document.getElementById('operationStatus');
const arraySize = document.getElementById('arraySize');
const arraySizeValue = document.getElementById('arraySizeValue');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const explanationContent = document.getElementById('explanationContent');
const themeToggle = document.getElementById('themeToggle');
const clearHistory = document.getElementById('clearHistory');

// Quick action buttons
const insertAction = document.getElementById('insertAction');
const deleteAction = document.getElementById('deleteAction');
const updateAction = document.getElementById('updateAction');
const searchAction = document.getElementById('searchAction');

// Modal elements
const insertModal = document.getElementById('insertModal');
const deleteModal = document.getElementById('deleteModal');
const updateModal = document.getElementById('updateModal');
const searchModal = document.getElementById('searchModal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generateRandomArray();
    updateArrayDisplay();

    // Event listeners
    generateBtn.addEventListener('click', generateRandomArray);
    resetBtn.addEventListener('click', resetArray);
    themeToggle.addEventListener('click', toggleTheme);
    clearHistory.addEventListener('click', clearOperationHistory);

    // Quick action listeners
    insertAction.addEventListener('click', () => openModal('insert'));
    deleteAction.addEventListener('click', () => openModal('delete'));
    updateAction.addEventListener('click', () => openModal('update'));
    searchAction.addEventListener('click', () => openModal('search'));

    // Modal close listeners
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeAllModals();
        });
    });

    // Cancel button listeners
    document.getElementById('cancelInsert').addEventListener('click', closeAllModals);
    document.getElementById('cancelDelete').addEventListener('click', closeAllModals);
    document.getElementById('cancelUpdate').addEventListener('click', closeAllModals);
    document.getElementById('cancelSearch').addEventListener('click', closeAllModals);

    // Confirm button listeners
    document.getElementById('confirmInsert').addEventListener('click', insertValue);
    document.getElementById('confirmDelete').addEventListener('click', deleteValue);
    document.getElementById('confirmUpdate').addEventListener('click', updateValue);
    document.getElementById('confirmSearch').addEventListener('click', searchValue);

    arraySize.addEventListener('input', () => {
        arraySizeValue.textContent = `${arraySize.value}`;
    });

    speedSlider.addEventListener('input', updateSpeed);
});

// Generate random array
function generateRandomArray() {
    const size = parseInt(arraySize.value);
    array = [];

    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 99) + 1);
    }

    updateArrayDisplay();
    addToHistory('Generated a new random array with ' + size + ' elements.', 'info');
    operationStatus.textContent = 'Array generated';
}

// Reset array
function resetArray() {
    array = [];
    updateArrayDisplay();
    addToHistory('Array has been reset. It is now empty.', 'info');
    operationStatus.textContent = 'Array reset';
}

// Insert value
function insertValue() {
    const value = parseInt(document.getElementById('insertValue').value);
    const index = document.getElementById('insertIndex').value ?
        parseInt(document.getElementById('insertIndex').value) : array.length;

    if (isNaN(value) || value < 1 || value > 99) {
        showError('insertValueError');
        return;
    }

    if (isNaN(index) || index < 0 || index > array.length) {
        showError('insertIndexError');
        return;
    }

    // Insert the value
    array.splice(index, 0, value);
    updateArrayDisplay();

    // Highlight the inserted element
    const elements = arrayContainer.querySelectorAll('.array-element');
    if (elements[index]) {
        elements[index].classList.add('inserted');

        // Remove the highlight after animation
        setTimeout(() => {
            elements[index].classList.remove('inserted');
        }, 1500);
    }

    addToHistory(`Inserted value ${value} at index ${index}. The array now has ${array.length} elements.`, 'insert');
    operationStatus.textContent = `Inserted ${value} at index ${index}`;

    // Clear inputs and close modal
    document.getElementById('insertValue').value = '';
    document.getElementById('insertIndex').value = '';
    closeAllModals();
}

// Delete value
function deleteValue() {
    const index = document.getElementById('deleteIndex').value ?
        parseInt(document.getElementById('deleteIndex').value) : array.length - 1;

    if (array.length === 0) {
        addToHistory('Array is empty. Nothing to delete.', 'info');
        operationStatus.textContent = 'Array is empty';
        closeAllModals();
        return;
    }

    if (isNaN(index) || index < 0 || index >= array.length) {
        showError('deleteIndexError');
        return;
    }

    const deletedValue = array[index];

    // Highlight the element to be deleted
    const elements = arrayContainer.querySelectorAll('.array-element');
    if (elements[index]) {
        elements[index].classList.add('deleted');

        // Remove the element after animation
        setTimeout(() => {
            array.splice(index, 1);
            updateArrayDisplay();
        }, 500);
    }

    addToHistory(`Deleted value ${deletedValue} from index ${index}. The array now has ${array.length - 1} elements.`, 'delete');
    operationStatus.textContent = `Deleted ${deletedValue} from index ${index}`;

    // Clear input and close modal
    document.getElementById('deleteIndex').value = '';
    closeAllModals();
}

// Update value
function updateValue() {
    const value = parseInt(document.getElementById('updateValue').value);
    const index = document.getElementById('updateIndex').value ?
        parseInt(document.getElementById('updateIndex').value) : 0;

    if (isNaN(value) || value < 1 || value > 99) {
        showError('updateValueError');
        return;
    }

    if (array.length === 0) {
        addToHistory('Array is empty. Nothing to update.', 'info');
        operationStatus.textContent = 'Array is empty';
        closeAllModals();
        return;
    }

    if (isNaN(index) || index < 0 || index >= array.length) {
        showError('updateIndexError');
        return;
    }

    const oldValue = array[index];
    array[index] = value;
    updateArrayDisplay();

    // Highlight the updated element
    const elements = arrayContainer.querySelectorAll('.array-element');
    if (elements[index]) {
        elements[index].classList.add('updated');

        // Remove the highlight after animation
        setTimeout(() => {
            elements[index].classList.remove('updated');
        }, 1000);
    }

    addToHistory(`Updated value at index ${index} from ${oldValue} to ${value}.`, 'update');
    operationStatus.textContent = `Updated index ${index} to ${value}`;

    // Clear inputs and close modal
    document.getElementById('updateValue').value = '';
    document.getElementById('updateIndex').value = '';
    closeAllModals();
}

// Search value
function searchValue() {
    const value = parseInt(document.getElementById('searchValue').value);

    if (isNaN(value) || value < 1 || value > 99) {
        showError('searchValueError');
        return;
    }

    if (array.length === 0) {
        addToHistory('Array is empty. Nothing to search.', 'info');
        operationStatus.textContent = 'Array is empty';
        closeAllModals();
        return;
    }

    addToHistory(`Searching for value ${value} in the array...`, 'search');
    operationStatus.textContent = `Searching for ${value}`;

    // Sequential search with highlighting
    const elements = arrayContainer.querySelectorAll('.array-element');
    let found = false;
    let i = 0;

    function searchStep() {
        if (i < array.length) {
            // Remove previous highlights
            elements.forEach(el => {
                el.classList.remove('searching', 'found', 'not-found');
            });

            // Highlight current element
            elements[i].classList.add('searching');

            addToHistory(`Checking index ${i}: value is ${array[i]}. ${array[i] === value ? 'Match found!' : 'Not a match, continuing search...'}`, 'search');

            if (array[i] === value) {
                elements[i].classList.remove('searching');
                elements[i].classList.add('found');
                addToHistory(`Value ${value} found at index ${i}! Search completed.`, 'search');
                operationStatus.textContent = `Found ${value} at index ${i}`;
                found = true;
                closeAllModals();
                return;
            }

            i++;
            setTimeout(searchStep, animationSpeed);
        } else {
            // Value not found
            if (!found) {
                addToHistory(`Value ${value} not found in the array. Search completed.`, 'search');
                operationStatus.textContent = `${value} not found`;

                // Briefly highlight all elements as not found
                elements.forEach(el => {
                    el.classList.add('not-found');
                });

                setTimeout(() => {
                    elements.forEach(el => {
                        el.classList.remove('not-found');
                    });
                }, 1000);
                closeAllModals();
            }
        }
    }

    searchStep();

    // Clear input
    document.getElementById('searchValue').value = '';
}

// Update animation speed
function updateSpeed() {
    const speed = parseInt(speedSlider.value);

    switch (speed) {
        case 1:
            animationSpeed = 1000;
            speedValue.textContent = 'Very Slow';
            break;
        case 2:
            animationSpeed = 750;
            speedValue.textContent = 'Slow';
            break;
        case 3:
            animationSpeed = 500;
            speedValue.textContent = 'Medium';
            break;
        case 4:
            animationSpeed = 250;
            speedValue.textContent = 'Fast';
            break;
        case 5:
            animationSpeed = 100;
            speedValue.textContent = 'Very Fast';
            break;
    }
}

// Update array display
function updateArrayDisplay() {
    arrayContainer.innerHTML = '';
    arrayLength.textContent = array.length;

    if (array.length === 0) {
        arrayContainer.innerHTML = `
                    <div class="empty-state">
                        <p>Your array is empty. Add some values to get started!</p>
                    </div>
                `;
        return;
    }

    array.forEach((value, index) => {
        const element = document.createElement('div');
        element.className = 'array-element';
        element.innerHTML = `
                    <div>${value}</div>
                    <div class="element-index">${index}</div>
                `;
        arrayContainer.appendChild(element);
    });
}

// Add to operation history
function addToHistory(text, type) {
    const step = document.createElement('div');
    step.className = `step ${type}`;
    step.innerHTML = `<strong>${new Date().toLocaleTimeString()}:</strong> ${text}`;

    explanationContent.insertBefore(step, explanationContent.firstChild);

    // Limit history to 20 items
    if (explanationContent.children.length > 20) {
        explanationContent.removeChild(explanationContent.lastChild);
    }

    operationHistory.unshift({ text, type, time: new Date() });
}

// Clear operation history
function clearOperationHistory() {
    explanationContent.innerHTML = '<div class="step">Operation history cleared</div>';
    operationHistory = [];
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');

    if (document.body.classList.contains('dark-theme')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> <span>Light Mode</span>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> <span>Dark Mode</span>';
    }
}

// Modal functions
function openModal(operation) {
    closeAllModals();

    // Reset error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });

    switch (operation) {
        case 'insert':
            insertModal.style.display = 'flex';
            break;
        case 'delete':
            deleteModal.style.display = 'flex';
            break;
        case 'update':
            updateModal.style.display = 'flex';
            break;
        case 'search':
            searchModal.style.display = 'flex';
            break;
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Error handling functions
function showError(errorId) {
    document.getElementById(errorId).style.display = 'block';
}