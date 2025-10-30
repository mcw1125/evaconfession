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

    // Navigation buttons
    document.getElementById('backToMenu1').addEventListener('click', () => showPage('page1'));
    document.getElementById('backToMenu2').addEventListener('click', () => showPage('page1'));
    document.getElementById('backToSins').addEventListener('click', () => showPage('page2'));
    document.getElementById('toScriptBtn').addEventListener('click', prepareConfessionScript);
    document.getElementById('saveConfessionBtn').addEventListener('click', saveConfession);

    // Search functionality (optional filter)
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

// Sin management - FIXED: Now displays all sins in a list with checkboxes
function loadSinsCategories() {
    const container = document.getElementById('sinsCategories');
    if (!container) return;
    
    container.innerHTML = '';
    
    sinsData.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'sin-category';
        categoryElement.innerHTML = `
            <div class="category-header">
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

// Confession script generation
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
                <div class="history-item-content" onclick="showConfessionDetail(${confession.id})">
                    <div class="history-item-time">${confession.fullDate}</div>
                    <div class="history-item-stats">
                        ${sinCount} thing${sinCount !== 1 ? 's' : ''} confessed
                    </div>
                    <div class="history-item-summary">Time since last confession: ${confession.timeSince || 'Not sure'}</div>
                </div>
                <div class="history-item-actions">
                    <button class="delete-confession" onclick="deleteConfession(${confession.id}, event)">Delete</button>
                </div>
            `;
            
            container.appendChild(historyItem);
        });
    });
}

function showConfessionDetail(confessionId) {
    const confession = confessionHistory.find(c => c.id === confessionId);
    if (!confession) return;
    
    // For children, we'll just show a simple view
    const container = document.getElementById('confessionHistory');
    
    // Create a modal-like display
    const detailView = document.createElement('div');
    detailView.className = 'confession-detail';
    detailView.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 15px;
        border: 3px solid #FFD700;
        z-index: 1000;
        max-width: 90%;
        max-height: 80%;
        overflow-y: auto;
    `;
    
    detailView.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h3>Confession from ${confession.date}</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 10px; right: 10px; background: #FF6B6B; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">X</button>
        </div>
        <div>${confession.script}</div>
    `;
    
    document.body.appendChild(detailView);
}

function deleteConfession(confessionId, event) {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this confession?')) {
        confessionHistory = confessionHistory.filter(confession => confession.id !== confessionId);
        localStorage.setItem('confessionHistory', JSON.stringify(confessionHistory));
        displayHistory();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
