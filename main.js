// SecureVault - Main JavaScript File
// Handles all core functionality and interactions

class SecureVault {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.vaultData = this.loadVaultData();
        this.securityScore = 95;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.updateSecurityScore();
        this.setupSearch();
    }

    // Authentication Methods
    authenticate(method, credentials) {
        return new Promise((resolve, reject) => {
            // Simulate authentication delay
            setTimeout(() => {
                if (method === 'pin' && credentials.pin === '1234') {
                    this.isAuthenticated = true;
                    this.currentUser = { id: 1, name: 'User' };
                    resolve({ success: true, user: this.currentUser });
                } else if (method === 'face') {
                    // Simulate face authentication
                    this.isAuthenticated = true;
                    this.currentUser = { id: 1, name: 'User' };
                    resolve({ success: true, user: this.currentUser });
                } else {
                    reject({ success: false, error: 'Invalid credentials' });
                }
            }, 1000);
        });
    }

    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.clearSensitiveData();
        window.location.href = 'auth.html';
    }

    // Data Management
    loadVaultData() {
        const stored = localStorage.getItem('secureVaultData');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Demo data for first-time users
        return {
            passwords: [
                { id: 1, title: 'Gmail Account', username: 'user@gmail.com', password: 'encrypted', url: 'https://gmail.com', lastUsed: Date.now() - 7200000 },
                { id: 2, title: 'Banking', username: 'customer123', password: 'encrypted', url: 'https://chase.com', lastUsed: Date.now() - 86400000 },
                { id: 3, title: 'Netflix', username: 'moviefan@email.com', password: 'encrypted', url: 'https://netflix.com', lastUsed: Date.now() - 172800000 }
            ],
            notes: [
                { id: 1, title: 'Banking PIN', content: 'encrypted', tags: ['banking', 'pin'], lastUsed: Date.now() - 86400000 },
                { id: 2, title: 'WiFi Passwords', content: 'encrypted', tags: ['wifi', 'home'], lastUsed: Date.now() - 259200000 }
            ],
            cards: [
                { id: 1, name: 'Chase Visa', number: 'encrypted', expiry: '12/25', cvv: 'encrypted', lastUsed: Date.now() - 432000000 }
            ],
            documents: [
                { id: 1, name: 'Passport Scan', type: 'pdf', encrypted: true, lastUsed: Date.now() - 604800000 }
            ]
        };
    }

    saveVaultData() {
        localStorage.setItem('secureVaultData', JSON.stringify(this.vaultData));
    }

    addItem(category, item) {
        if (!this.vaultData[category]) {
            this.vaultData[category] = [];
        }
        
        const newItem = {
            ...item,
            id: Date.now(),
            createdAt: Date.now(),
            lastUsed: Date.now()
        };
        
        this.vaultData[category].push(newItem);
        this.saveVaultData();
        this.updateStats();
        
        return newItem;
    }

    deleteItem(category, id) {
        if (this.vaultData[category]) {
            this.vaultData[category] = this.vaultData[category].filter(item => item.id !== id);
            this.saveVaultData();
            this.updateStats();
        }
    }

    // Search Functionality
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
        }
    }

    performSearch(query) {
        if (!query.trim()) {
            this.clearSearchResults();
            return;
        }

        const results = this.searchVault(query.toLowerCase());
        this.displaySearchResults(results);
    }

    searchVault(query) {
        const results = {
            passwords: [],
            notes: [],
            cards: [],
            documents: []
        };

        // Search passwords
        this.vaultData.passwords.forEach(item => {
            if (item.title.toLowerCase().includes(query) || 
                item.username.toLowerCase().includes(query) ||
                item.url.toLowerCase().includes(query)) {
                results.passwords.push(item);
            }
        });

        // Search notes
        this.vaultData.notes.forEach(item => {
            if (item.title.toLowerCase().includes(query) || 
                item.tags.some(tag => tag.toLowerCase().includes(query))) {
                results.notes.push(item);
            }
        });

        // Search cards
        this.vaultData.cards.forEach(item => {
            if (item.name.toLowerCase().includes(query)) {
                results.cards.push(item);
            }
        });

        // Search documents
        this.vaultData.documents.forEach(item => {
            if (item.name.toLowerCase().includes(query)) {
                results.documents.push(item);
            }
        });

        return results;
    }

    displaySearchResults(results) {
        // This would update the UI to show search results
        console.log('Search results:', results);
        // Implementation would depend on the specific UI design
    }

    clearSearchResults() {
        // Clear search results from UI
        console.log('Search cleared');
    }

    // Security Methods
    updateSecurityScore() {
        let score = 100;
        
        // Check for weak passwords
        const weakPasswords = this.checkPasswordStrength();
        score -= weakPasswords * 10;
        
        // Check for old items (not updated in 90 days)
        const oldItems = this.checkOldItems();
        score -= oldItems * 5;
        
        // Check for missing two-factor auth
        if (!this.hasTwoFactorAuth()) {
            score -= 15;
        }
        
        this.securityScore = Math.max(0, score);
        this.updateSecurityDisplay();
    }

    checkPasswordStrength() {
        // Simulate password strength checking
        return Math.floor(Math.random() * 3); // 0-2 weak passwords
    }

    checkOldItems() {
        const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
        let oldCount = 0;
        
        Object.values(this.vaultData).forEach(category => {
            category.forEach(item => {
                if (item.lastUsed < ninetyDaysAgo) {
                    oldCount++;
                }
            });
        });
        
        return oldCount;
    }

    hasTwoFactorAuth() {
        // Simulate two-factor auth check
        return Math.random() > 0.3; // 70% chance of having 2FA
    }

    updateSecurityDisplay() {
        const scoreElement = document.querySelector('[data-security-score]');
        if (scoreElement) {
            scoreElement.textContent = `${this.securityScore}/100`;
        }
        
        // Update security meter color
        const meter = document.querySelector('.security-meter');
        if (meter) {
            let color = '#2a9d8f'; // Green (good)
            if (this.securityScore < 70) {
                color = '#e76f51'; // Red (poor)
            } else if (this.securityScore < 85) {
                color = '#f4a261'; // Yellow (fair)
            }
            meter.style.background = `conic-gradient(from 0deg, ${color} 0deg, ${color} ${this.securityScore * 3.6}deg, #e5e7eb ${this.securityScore * 3.6}deg, #e5e7eb 360deg)`;
        }
    }

    // Encryption Simulation
    simulateEncryption(data) {
        // Simulate encryption process with visual feedback
        return new Promise((resolve) => {
            console.log('Encrypting data...', data);
            
            // Simulate encryption delay
            setTimeout(() => {
                const encrypted = btoa(JSON.stringify(data)); // Simple base64 encoding for demo
                resolve(encrypted);
            }, 500);
        });
    }

    simulateDecryption(encryptedData) {
        // Simulate decryption process
        return new Promise((resolve, reject) => {
            try {
                const decrypted = JSON.parse(atob(encryptedData));
                resolve(decrypted);
            } catch (error) {
                reject(error);
            }
        });
    }

    // UI Update Methods
    updateStats() {
        const totalItems = Object.values(this.vaultData).reduce((sum, category) => sum + category.length, 0);
        const totalPasswords = this.vaultData.passwords.length;
        const totalNotes = this.vaultData.notes.length;
        
        // Update UI elements
        const totalElement = document.getElementById('totalItems');
        if (totalElement) {
            totalElement.textContent = totalItems;
        }
        
        // Animate number changes
        this.animateNumberChange(totalElement, totalItems);
    }

    animateNumberChange(element, newValue) {
        if (!element) return;
        
        const currentValue = parseInt(element.textContent) || 0;
        const increment = (newValue - currentValue) / 20;
        let step = 0;
        
        const animation = setInterval(() => {
            step++;
            const value = Math.round(currentValue + (increment * step));
            element.textContent = value;
            
            if (step >= 20) {
                element.textContent = newValue;
                clearInterval(animation);
            }
        }, 50);
    }

    // Animation Methods
    initializeAnimations() {
        // Animate elements on page load
        const elements = document.querySelectorAll('.vault-card, .category-card, .setting-item');
        if (elements.length > 0) {
            anime({
                targets: elements,
                translateY: [20, 0],
                opacity: [0, 1],
                duration: 600,
                delay: anime.stagger(100),
                easing: 'easeOutQuad'
            });
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Handle navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-navigate]')) {
                const page = e.target.getAttribute('data-navigate');
                window.location.href = page;
            }
        });

        // Handle form submissions
        document.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(e.target);
        });

        // Handle category clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-category]')) {
                const category = e.target.closest('[data-category]').getAttribute('data-category');
                this.openCategory(category);
            }
        });
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate saving with encryption
        this.simulateEncryption(data).then(() => {
            this.showSuccessMessage('Data saved securely');
        });
    }

    // Navigation Methods
    openCategory(category) {
        // Store selected category and navigate to detail view
        sessionStorage.setItem('selectedCategory', category);
        window.location.href = `category.html?type=${category}`;
    }

    // Utility Methods
    showSuccessMessage(message) {
        const popup = document.createElement('div');
        popup.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';
        popup.innerHTML = `
            <div class="bg-white rounded-2xl p-6 text-center mx-4">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Success</h3>
                <p class="text-gray-600 text-sm">${message}</p>
                <button onclick="this.parentElement.parentElement.remove()" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Continue
                </button>
            </div>
        `;
        document.body.appendChild(popup);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (popup.parentElement) {
                popup.remove();
            }
        }, 3000);
    }

    showComingSoon() {
        const popup = document.createElement('div');
        popup.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';
        popup.innerHTML = `
            <div class="bg-white rounded-2xl p-6 text-center mx-4">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Coming Soon</h3>
                <p class="text-gray-600 text-sm">This feature will be available in a future update.</p>
                <button onclick="this.parentElement.parentElement.remove()" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Got it
                </button>
            </div>
        `;
        document.body.appendChild(popup);
    }

    clearSensitiveData() {
        // Clear sensitive data from memory
        this.currentUser = null;
        // Note: In a real app, you'd also clear any cached decrypted data
    }

    // Security Audit
    performSecurityAudit() {
        const audit = {
            timestamp: Date.now(),
            score: this.securityScore,
            recommendations: []
        };

        if (this.securityScore < 70) {
            audit.recommendations.push('Enable two-factor authentication');
            audit.recommendations.push('Update weak passwords');
        }

        if (this.checkOldItems() > 0) {
            audit.recommendations.push('Review and update old vault items');
        }

        return audit;
    }
}

// Global Functions (for HTML onclick handlers)
function openCategory(category) {
    vault.openCategory(category);
}

function showComingSoon() {
    vault.showComingSoon();
}

function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
}

// Initialize the vault when the page loads
let vault;
document.addEventListener('DOMContentLoaded', function() {
    vault = new SecureVault();
    
    // Page-specific initialization
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
        case 'index.html':
        case '':
            initializeHomePage();
            break;
        case 'auth.html':
            initializeAuthPage();
            break;
        case 'add-data.html':
            initializeAddDataPage();
            break;
        case 'settings.html':
            initializeSettingsPage();
            break;
    }
});

// Page-specific initialization functions
function initializeHomePage() {
    // Update stats on home page
    vault.updateStats();
    vault.updateSecurityScore();
    
    // Setup quick actions
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-action]')) {
            const action = e.target.getAttribute('data-action');
            handleQuickAction(action);
        }
    });
}

function initializeAuthPage() {
    // Authentication page is handled by its own script
}

function initializeAddDataPage() {
    // Add data page is handled by its own script
}

function initializeSettingsPage() {
    // Settings page is handled by its own script
}

function handleQuickAction(action) {
    switch (action) {
        case 'add-item':
            window.location.href = 'add-data.html';
            break;
        case 'security-scan':
            const audit = vault.performSecurityAudit();
            vault.showSuccessMessage(`Security score: ${audit.score}/100. ${audit.recommendations.length} recommendations.`);
            break;
        case 'backup':
            vault.showSuccessMessage('Backup completed successfully');
            break;
        default:
            vault.showComingSoon();
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecureVault;
}