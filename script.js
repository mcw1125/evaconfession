// Global variables for children's app
let selectedSins = [];
let confessionHistory = JSON.parse(localStorage.getItem('confessionHistory')) || [];
let usedQuoteIndices = [];

// Initialize the app
function initApp() {
    console.log('Initializing children\'s app...');
    setupEventListeners();
    displayDailyQuote();
    
    // Load confession history
    const savedHistory = localStorage.getItem('confessionHistory');
    if (savedHistory) {
        confessionHistory = JSON.parse(savedHistory);
    }
    
    // Reset selected sins on app start
    selectedSins = [];
    
    console.log('Children\'s app initialized successfully');
}

// Setup all event listeners
function setupEventListeners() {
    // Main menu buttons
    document.getElementById('newConfessionBtn').addEventListener('click', newConfession);
    document.getElementById('viewHistoryBtn').addEventListener('click', showHistory);
    document.getElementById('exportBtn').addEventListener('click', exportConfessions);
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', importConfessions);

    // Navigation buttons
    document.getElementById('backToMenu1').addEventListener('click', () => showPage('page1'));
    document.getElementById('backToMenu2').addEventListener('click', () => showPage('page1'));
    document.getElementById('backToHistory').addEventListener('click', () => showPage('page4'));
    document.getElementById('backToSins').addEventListener('click', () => showPage('page2'));
    document.getElementById('toScriptBtn').addEventListener('click', prepareConfessionScript);
    document.getElementById('saveConfessionBtn').addEventListener('click', saveConfession);

    // Search functionality
    document.getElementById('sinSearch').addEventListener('input', (e) => {
        filterSins(e.target.value);
    });
}

// Page navigation
function showPage(pageId) {
    console.log('Showing page:', pageId);
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
    
    if (pageId === 'page2') {
        resetSinSelection();
        loadSinsCategories();
        updateSelectedSinsList();
    } else if (pageId === 'page3') {
        generateFullScript();
    } else if (pageId === 'page4') {
        displayHistory();
    }
}

function newConfession() {
    // Completely reset everything for a new confession
    selectedSins = [];
    
    // Clear any search input
    const searchInput = document.getElementById('sinSearch');
    if (searchInput) {
        searchInput.value = '';
    }
    
    showPage('page2');
}

function showHistory() {
    showPage('page4');
}

// Reset sin selection - uncheck all checkboxes and clear selections
function resetSinSelection() {
    // Clear the selected sins array
    selectedSins = [];
    
    // Uncheck all checkboxes in the sins categories
    const checkboxes = document.querySelectorAll('.sin-checkbox-label input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear the search filter and show all categories
    const categories = document.querySelectorAll('.sin-category');
    categories.forEach(category => {
        category.style.display = 'block';
        const sinItems = category.querySelectorAll('.sin-item');
        sinItems.forEach(item => {
            item.style.display = 'flex';
        });
    });
    
    // Clear selected sins list
    updateSelectedSinsList();
}

// Quote system
function getRandomQuote() {
    if (usedQuoteIndices.length >= confessionQuotes.length) {
        usedQuoteIndices = [];
    }
    
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * confessionQuotes.length);
    } while (usedQuoteIndices.includes(randomIndex));
    
    usedQuoteIndices.push(randomIndex);
    return confessionQuotes[randomIndex];
}

function displayDailyQuote() {
    const quoteElement = document.getElementById('dailyQuote');
    if (quoteElement && confessionQuotes) {
        const quote = getRandomQuote();
        quoteElement.innerHTML = `<em>"${quote.text}"</em><br>- ${quote.source}`;
    } else {
        quoteElement.innerHTML = '<em>"Jesus loves you very much!"</em>';
    }
}

// Sin management
function loadSinsCategories() {
    const container = document.getElementById('sinsCategories');
    if (!container) return;
    
    container.innerHTML = '';
    
    sinsData.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'sin-category';
        categoryElement.innerHTML = `
            <div class="category-header" onclick="toggleCategory(this)">
                ${category.category}
            </div>
            <div class="sin-items">
                ${category.sins.map(sin => `
                    <div class="sin-item ${sin.type}">
                        <label class="sin-checkbox-label">
                            <input type="checkbox" 
                                   onchange="toggleSin('${sin.text.replace(/'/g, "\\'")}', '${sin.type}', this.checked)">
                            <span class="sin-text">${sin.text}</span>
                            <span class="sin-type ${sin.type}">${sin.type}</span>
                        </label>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(categoryElement);
    });
}

function toggleCategory(header) {
    const items = header.parentElement.querySelector('.sin-items');
    items.classList.toggle('hidden');
}

function toggleSin(sinText, sinType, isChecked) {
    if (isChecked) {
        if (!selectedSins.find(sin => sin.text === sinText)) {
            selectedSins.push({ text: sinText, type: sinType });
        }
    } else {
        selectedSins = selectedSins.filter(sin => sin.text !== sinText);
    }
    updateSelectedSinsList();
}

function removeSin(sinText) {
    selectedSins = selectedSins.filter(sin => sin.text !== sinText);
    // Also uncheck the checkbox
    const checkboxes = document.querySelectorAll(`input[type="checkbox"]`);
    checkboxes.forEach(checkbox => {
        if (checkbox.getAttribute('onchange')?.includes(sinText.replace(/'/g, "\\'"))) {
            checkbox.checked = false;
        }
    });
    updateSelectedSinsList();
}

function updateSelectedSinsList() {
    const container = document.getElementById('selectedSinsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (selectedSins.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #7f8c8d; font-size: 18px;">No sins selected yet. Think about ways you may have not followed Jesus\' way.</p>';
        return;
    }
    
    selectedSins.forEach(sin => {
        const sinElement = document.createElement('div');
        sinElement.className = `selected-sin-item ${sin.type}`;
        sinElement.innerHTML = `
            <span class="sin-text">${sin.text}</span>
            <span class="sin-type ${sin.type}">${sin.type}</span>
            <button class="remove-sin" onclick="removeSin('${sin.text.replace(/'/g, "\\'")}')">Remove</button>
        `;
        container.appendChild(sinElement);
    });
}

function filterSins(searchTerm) {
    const categories = document.querySelectorAll('.sin-category');
    
    categories.forEach(category => {
        const sinItems = category.querySelectorAll('.sin-item');
        let hasVisibleItems = false;
        
        sinItems.forEach(item => {
            const sinText = item.querySelector('.sin-text').textContent;
            if (sinText.toLowerCase().includes(searchTerm.toLowerCase())) {
                item.style.display = 'flex';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        category.style.display = hasVisibleItems ? 'block' : 'none';
    });
}

// Confession script generation - CHILD-FRIENDLY VERSION
function generateFullScript() {
    const container = document.getElementById('fullConfessionScript');
    if (!container) return;
    
    let sinsHTML = '';
    selectedSins.forEach(sin => {
        sinsHTML += `<li class="${sin.type}">${sin.text} <span class="sin-type-badge ${sin.type}">${sin.type}</span></li>`;
    });
    
    container.innerHTML = `
        <div class="script-section priest">
            <h4>Priest:</h4>
            <p>"In the name of the Father, and of the Son, and of the Holy Spirit. Amen."</p>
            <p>"May God be in your heart and help you to confess your sins. In the name of the Father, and of the Son, and of the Holy Spirit. Amen."</p>
        </div>

        <div class="script-section penitent">
            <h4>You:</h4>
            <p>"Bless me, Father, for I have sinned. It has been <strong><span id="dynamicTimeSince">[time]</span></strong> since my last confession."</p>
            
            <div class="time-input">
                <label for="timeSinceInput">How long since your last confession?</label>
                <input type="text" id="timeSinceInput" placeholder="e.g., 2 weeks, 1 month, 3 months" value="">
            </div>

            <div class="sins-list">
                <h5>These are my sins:</h5>
                <ul>${sinsHTML}</ul>
            </div>

            <p>"I am sorry for these sins and all the sins of my whole life."</p>
        </div>

        <div class="script-section priest">
            <h4>Priest (may say):</h4>
            <p>"God loves you very much and through Jesus, He forgives all your sins. I absolve you from your sins in the name of the Father, and of the Son, and of the Holy Spirit. Amen."</p>
            <p>"Give thanks to the Lord, for He is good."</p>
        </div>

        <div class="script-section penitent">
            <h4>You (pray the Act of Contrition):</h4>
            <div class="act-of-contrition">
                <p>O my God, I am sorry for my sins with all my heart. In choosing to do wrong and failing to do good, I have sinned against You whom I should love above all things. I firmly intend, with Your help, to do penance, to sin no more, and to avoid whatever leads me to sin. Our Savior Jesus Christ suffered and died for us. In His name, my God, have mercy. Amen.</p>
            </div>
        </div>

        <div class="script-section priest">
            <h4>Priest:</h4>
            <p>"God has forgiven your sins. Go in peace, and be good."</p>
        </div>

        <div class="script-section penitent">
            <h4>You:</h4>
            <p>"Thank you, Father. Thanks be to God."</p>
        </div>
    `;

    // Add event listener for time input
    const timeInput = document.getElementById('timeSinceInput');
    if (timeInput) {
        timeInput.addEventListener('input', function(e) {
            const dynamicElement = document.getElementById('dynamicTimeSince');
            if (dynamicElement) {
                dynamicElement.textContent = e.target.value || '[time]';
            }
        });
    }
}

function prepareConfessionScript() {
    if (selectedSins.length === 0) {
        alert('Please select at least one thing you want to confess.');
        return;
    }
    
    showPage('page3');
}

// Save confession
function saveConfession() {
    const timeSinceInput = document.getElementById('timeSinceInput');
    
    let timeSince = '';
    if (timeSinceInput && timeSinceInput.value) {
        timeSince = timeSinceInput.value;
    }
    
    const date = new Date().toLocaleDateString();
    const fullDate = new Date().toLocaleString();
    
    // Get the full script HTML
    const scriptContainer = document.getElementById('fullConfessionScript');
    let scriptHTML = '';
    if (scriptContainer) {
        scriptHTML = scriptContainer.innerHTML;
    }
    
    const confession = {
        id: Date.now(), // Unique ID for each confession
        date: date,
        fullDate: fullDate,
        timeSince: timeSince,
        sins: [...selectedSins],
        script: scriptHTML,
        penance: {
            hailMarys: 0,
            ourFathers: 0,
            divineMercy: false,
            generalPrayer: false,
            rosary: false,
            other: ''
        },
        timestamp: new Date().toISOString()
    };
    
    confessionHistory.unshift(confession);
    localStorage.setItem('confessionHistory', JSON.stringify(confessionHistory));
    
    // Reset for new confession
    selectedSins = [];
    
    alert('Your confession has been saved! You can look at it later in your history.');
    showPage('page1');
}

// History
function displayHistory() {
    const container = document.getElementById('confessionHistory');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (confessionHistory.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 20px; font-size: 18px;">You haven\'t saved any confessions yet.</p>';
        return;
    }
    
    // Group by date
    const groupedByDate = {};
    confessionHistory.forEach(confession => {
        if (!groupedByDate[confession.date]) {
            groupedByDate[confession.date] = [];
        }
        groupedByDate[confession.date].push(confession);
    });
    
    // Display grouped by date
    Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
        const dateHeader = document.createElement('div');
        dateHeader.className = 'history-date-header';
        dateHeader.textContent = date;
        container.appendChild(dateHeader);
        
        groupedByDate[date].forEach(confession => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const sinCount = confession.sins.length;
            
            historyItem.innerHTML = `
                <div class="history-item-content">
                    <div class="history-item-time">${confession.fullDate}</div>
                    <div class="history-item-stats">
                        ${sinCount} thing${sinCount !== 1 ? 's' : ''} confessed
                    </div>
                    <div class="history-item-summary">Time since last confession: ${confession.timeSince || 'Not sure'}</div>
                    ${getPenanceSummary(confession.penance)}
                </div>
                <div class="history-item-actions">
                    <button class="view-details-btn" onclick="showConfessionDetail(${confession.id})">View</button>
                    <button class="delete-confession" onclick="deleteConfession(${confession.id}, event)">Delete</button>
                </div>
            `;
            
            container.appendChild(historyItem);
        });
    });
}

function getPenanceSummary(penance) {
    if (!penance) return '<div class="history-item-penance">No penance recorded</div>';
    
    const parts = [];
    
    if (penance.hailMarys > 0) {
        parts.push(`${penance.hailMarys} Hail Mary${penance.hailMarys > 1 ? 's' : ''}`);
    }
    
    if (penance.ourFathers > 0) {
        parts.push(`${penance.ourFathers} Our Father${penance.ourFathers > 1 ? 's' : ''}`);
    }
    
    if (penance.divineMercy) parts.push('Divine Mercy Chaplet');
    if (penance.generalPrayer) parts.push('General Prayer');
    if (penance.rosary) parts.push('Rosary');
    if (penance.other) parts.push(penance.other);
    
    if (parts.length === 0) {
        return '<div class="history-item-penance">No penance recorded</div>';
    }
    
    return `<div class="history-item-penance">Penance: ${parts.join(', ')}</div>`;
}

function showConfessionDetail(confessionId) {
    const confession = confessionHistory.find(c => c.id === confessionId);
    if (!confession) return;
    
    const container = document.getElementById('confessionDetail');
    if (!container) return;
    
    // Ensure penance object exists with proper structure
    if (!confession.penance) {
        confession.penance = {
            hailMarys: 0,
            ourFathers: 0,
            divineMercy: false,
            generalPrayer: false,
            rosary: false,
            other: ''
        };
    }
    
    container.innerHTML = `
        <div class="detail-header">
            <h3>Confession from ${confession.fullDate}</h3>
        </div>
        <div class="full-script">
            ${confession.script}
        </div>
        <div class="penance-section">
            <h4>Penance Received</h4>
            <div class="penance-options">
                <div class="penance-option">
                    <input type="checkbox" id="detailDivineMercy" ${confession.penance.divineMercy ? 'checked' : ''}>
                    <label for="detailDivineMercy">Divine Mercy Chaplet</label>
                </div>
                <div class="penance-option">
                    <input type="checkbox" id="detailGeneralPrayer" ${confession.penance.generalPrayer ? 'checked' : ''}>
                    <label for="detailGeneralPrayer">General Prayer</label>
                </div>
                <div class="penance-option">
                    <input type="checkbox" id="detailRosary" ${confession.penance.rosary ? 'checked' : ''}>
                    <label for="detailRosary">Rosary</label>
                </div>
                <div class="penance-count-option">
                    <label for="detailHailMaryCount">Hail Marys:</label>
                    <input type="number" id="detailHailMaryCount" min="0" max="50" value="${confession.penance.hailMarys || 0}">
                </div>
                <div class="penance-count-option">
                    <label for="detailOurFatherCount">Our Fathers:</label>
                    <input type="number" id="detailOurFatherCount" min="0" max="50" value="${confession.penance.ourFathers || 0}">
                </div>
                <div class="penance-other-option">
                    <label for="detailOtherPenance">Other Penance:</label>
                    <input type="text" id="detailOtherPenance" placeholder="e.g., Station of the Cross, specific prayer..." value="${confession.penance.other || ''}">
                </div>
            </div>
            <button onclick="savePenance(${confession.id})" class="btn-primary">Save Penance</button>
        </div>
    `;
    
    showPage('page5');
}

function savePenance(confessionId) {
    const confession = confessionHistory.find(c => c.id === confessionId);
    
    if (confession) {
        confession.penance = {
            hailMarys: parseInt(document.getElementById('detailHailMaryCount').value) || 0,
            ourFathers: parseInt(document.getElementById('detailOurFatherCount').value) || 0,
            divineMercy: document.getElementById('detailDivineMercy').checked,
            generalPrayer: document.getElementById('detailGeneralPrayer').checked,
            rosary: document.getElementById('detailRosary').checked,
            other: document.getElementById('detailOtherPenance').value || ''
        };
        
        localStorage.setItem('confessionHistory', JSON.stringify(confessionHistory));
        alert('Penance saved!');
        
        // Update the history view to show the new penance
        displayHistory();
        showPage('page4');
    }
}

function deleteConfession(confessionId, event) {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this confession? This action cannot be undone.')) {
        confessionHistory = confessionHistory.filter(confession => confession.id !== confessionId);
        localStorage.setItem('confessionHistory', JSON.stringify(confessionHistory));
        displayHistory();
    }
}

// Export/Import functions
function exportConfessions() {
    if (confessionHistory.length === 0) {
        alert('No confessions to export.');
        return;
    }
    
    const data = JSON.stringify(confessionHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Create filename with current date
    const date = new Date().toISOString().split('T')[0];
    a.download = `confession-backup-${date}.json`;
    
    // Track if the download was actually initiated
    let downloadStarted = false;
    
    // Add event listeners to track if download actually happens
    a.addEventListener('click', () => {
        downloadStarted = true;
    });
    
    // Add timeout to check if download was initiated
    setTimeout(() => {
        if (!downloadStarted) {
            // User likely canceled the download
            URL.revokeObjectURL(url);
            return; // No alert message
        }
    }, 100);
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Show success message only if download was likely initiated
    setTimeout(() => {
        if (downloadStarted) {
            alert(`Exported ${confessionHistory.length} confessions!`);
        }
        URL.revokeObjectURL(url);
    }, 500);
}

// Alternative simpler export function that doesn't show false success messages
function exportConfessionsSimple() {
    if (confessionHistory.length === 0) {
        alert('No confessions to export.');
        return;
    }
    
    const data = JSON.stringify(confessionHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Create filename with current date
    const date = new Date().toISOString().split('T')[0];
    a.download = `confession-backup-${date}.json`;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Don't show success message - let the browser's download behavior speak for itself
    // The file will either download or the user will see their browser's cancel option
    
    // Clean up the URL after a delay
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}

function importConfessions(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.name.endsWith('.json')) {
        alert('Please select a JSON file.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate the imported data structure
            if (!Array.isArray(importedData)) {
                throw new Error('Invalid file format');
            }
            
            if (confirm(`This will import ${importedData.length} confessions. Do you want to replace your current confessions or add to them? Press OK to replace, Cancel to add.`)) {
                // Replace current data
                confessionHistory = importedData;
            } else {
                // Add to current data (avoid duplicates by ID)
                importedData.forEach(confession => {
                    if (!confessionHistory.find(c => c.id === confession.id)) {
                        confessionHistory.push(confession);
                    }
                });
            }
            
            // Save to localStorage
            localStorage.setItem('confessionHistory', JSON.stringify(confessionHistory));
            
            // Update the display
            displayHistory();
            
            alert(`Successfully imported ${importedData.length} confessions!`);
            
            // Reset the file input
            event.target.value = '';
            
        } catch (error) {
            console.error('Import error:', error);
            alert('Error importing confessions. Please make sure you selected a valid confession backup file.');
        }
    };
    
    reader.onerror = function() {
        alert('Error reading the file. Please try again.');
    };
    
    reader.readAsText(file);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
