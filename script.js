        // Hey dude. Miatas ftw. 
        // The password is OceanSide. 

        const PASSWORD = "OceanSide";
        const POINTS_SERVER = 2, POINTS_BUSSER = 1, POINTS_HOST = 0.5;

        const overlay = document.getElementById("overlay");
        const passwordInput = document.getElementById("password");
        const loginButton = document.getElementById("login-button");
        const errorText = document.getElementById("error");
        const calculator = document.getElementById("calculator");
        const historySection = document.getElementById("history-section");

        // In-memory storage for tip history
        let tipHistory = [];
        let lastCalculation = null;

        // Show overlay on load
        window.addEventListener("DOMContentLoaded", () => {
            overlay.classList.add("active");
            calculator.style.display = "none";
        });

        // Password check
        function checkPassword() {
            if (passwordInput.value === PASSWORD) {
                overlay.style.opacity = 0;
                overlay.style.pointerEvents = "none";
                setTimeout(() => {
                    overlay.style.display = "none";
                    calculator.style.display = "block";
                    historySection.style.display = "block";
                    updateHistoryDisplay();
                }, 500);
            } else {
                errorText.textContent = "Incorrect password!";
            }
        }

        loginButton.addEventListener("click", checkPassword);
        passwordInput.addEventListener("keyup", e => { if (e.key === "Enter") checkPassword(); });

        // Calculator logic with rounding
        const calculateButton = document.getElementById("calculate");
        calculateButton.addEventListener("click", () => {
            const cash = parseFloat(document.getElementById("total-cash").value) || 0;
            const servers = parseInt(document.getElementById("servers").value) || 0;
            const bussers = parseInt(document.getElementById("bussers").value) || 0;
            const hosts = parseInt(document.getElementById("hosts").value) || 0;

            const totalPoints = servers * POINTS_SERVER + bussers * POINTS_BUSSER + hosts * POINTS_HOST;
            if (totalPoints === 0) {
                document.getElementById("results").innerHTML = `
                    <div class="results-container">
                        <div class="error-card">
                            <div class="error-icon">⚠️</div>
                            <p>Please enter at least one employee to calculate tips!</p>
                        </div>
                    </div>
                `;
                return;
            }

            const valuePerPoint = cash / totalPoints;

            // Round down to whole number
            const serverPay = Math.floor(POINTS_SERVER * valuePerPoint);
            const busserPay = Math.floor(POINTS_BUSSER * valuePerPoint);
            const hostPay = Math.floor(POINTS_HOST * valuePerPoint);

            const totalDistributed = servers * serverPay + bussers * busserPay + hosts * hostPay;
            const excess = cash - totalDistributed;

            // Store calculation for saving
            lastCalculation = {
                cash,
                servers,
                bussers,
                hosts,
                serverPay,
                busserPay,
                hostPay,
                totalDistributed,
                excess,
                timestamp: new Date()
            };

            let resultsHTML = `
                <div class="results-container">
                    <div class="results-header">
                        <h3>💰 Tip Distribution Results</h3>
                        <div class="total-summary">
                            <span class="total-label">Total Tips:</span>
                            <span class="total-amount">$${cash.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div class="distribution-cards">
            `;

            // Add server cards if there are servers
            if (servers > 0) {
                resultsHTML += `
                    <div class="role-card server-card">
                        <div class="role-header">
                            <span class="role-icon">🍽️</span>
                            <div class="role-info">
                                <h4>Servers/Bartenders</h4>
                                <span class="role-count">${servers} ${servers === 1 ? 'person' : 'people'}</span>
                            </div>
                        </div>
                        <div class="pay-info">
                            <div class="per-person">
                                <span class="amount">$${serverPay}</span>
                                <span class="label">per person</span>
                            </div>
                            <div class="total-role">
                                <span class="total-amount">$${servers * serverPay}</span>
                                <span class="label">total</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            // Add busser cards if there are bussers
            if (bussers > 0) {
                resultsHTML += `
                    <div class="role-card busser-card">
                        <div class="role-header">
                            <span class="role-icon">🧹</span>
                            <div class="role-info">
                                <h4>Bussers</h4>
                                <span class="role-count">${bussers} ${bussers === 1 ? 'person' : 'people'}</span>
                            </div>
                        </div>
                        <div class="pay-info">
                            <div class="per-person">
                                <span class="amount">$${busserPay}</span>
                                <span class="label">per person</span>
                            </div>
                            <div class="total-role">
                                <span class="total-amount">$${bussers * busserPay}</span>
                                <span class="label">total</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            // Add host cards if there are hosts
            if (hosts > 0) {
                resultsHTML += `
                    <div class="role-card host-card">
                        <div class="role-header">
                            <span class="role-icon">🏨</span>
                            <div class="role-info">
                                <h4>Hosts</h4>
                                <span class="role-count">${hosts} ${hosts === 1 ? 'person' : 'people'}</span>
                            </div>
                        </div>
                        <div class="pay-info">
                            <div class="per-person">
                                <span class="amount">$${hostPay}</span>
                                <span class="label">per person</span>
                            </div>
                            <div class="total-role">
                                <span class="total-amount">$${hosts * hostPay}</span>
                                <span class="label">total</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            // Add excess card if there's excess money
            if (excess > 0) {
                resultsHTML += `
                    <div class="excess-card">
                        <div class="excess-header">
                            <span class="excess-icon">💼</span>
                            <div class="excess-info">
                                <h4>Manager's Discretion</h4>
                                <span class="excess-note">Remaining after distribution</span>
                            </div>
                        </div>
                        <div class="excess-amount">$${excess.toFixed(2)}</div>
                    </div>
                `;
            }

            resultsHTML += `
                    </div>
                    
                    <div class="summary-footer">
                        <div class="distributed-amount">
                            <span class="label">Distributed:</span>
                            <span class="amount">$${totalDistributed.toFixed(2)}</span>
                        </div>
                    </div>

                    <div class="save-section">
                        <h3>💾 Save This Calculation</h3>
                        <label>Date:<input type="date" id="save-date" class="date-input" value="${new Date().toISOString().split('T')[0]}"></label>
                        <button id="save-calculation" class="save-btn">Save to History</button>
                    </div>
                </div>
            `;

            document.getElementById("results").innerHTML = resultsHTML;

            // Add save functionality
            document.getElementById("save-calculation").addEventListener("click", saveCalculation);

            // Add animation to cards
            setTimeout(() => {
                const cards = document.querySelectorAll('.role-card, .excess-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = 'slideInUp 0.5s ease-out forwards';
                    }, index * 100);
                });
            }, 50);
        });

        function saveCalculation() {
            if (!lastCalculation) return;

            const saveDate = document.getElementById("save-date").value;
            if (!saveDate) {
                alert("Please select a date!");
                return;
            }

            const historyEntry = {
                ...lastCalculation,
                date: saveDate,
                id: Date.now() // Simple ID generation
            };

            // Check if entry for this date already exists
            const existingIndex = tipHistory.findIndex(entry => entry.date === saveDate);
            if (existingIndex !== -1) {
                if (confirm("An entry for this date already exists. Do you want to replace it?")) {
                    tipHistory[existingIndex] = historyEntry;
                } else {
                    return;
                }
            } else {
                tipHistory.push(historyEntry);
            }

            // Sort by date (newest first)
            tipHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

            updateHistoryDisplay();
            alert("Calculation saved successfully!");
        }

        function updateHistoryDisplay() {
            const historyList = document.getElementById("history-list");
            
            if (tipHistory.length === 0) {
                historyList.innerHTML = '<div class="no-history">No tip calculations saved yet. Calculate and save some tips to see them here!</div>';
                return;
            }

            let historyHTML = '';
            tipHistory.forEach(entry => {
                const date = new Date(entry.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                historyHTML += `
                    <div class="history-entry">
                        <button class="delete-entry" onclick="deleteHistoryEntry(${entry.id})">×</button>
                        <div class="history-date">${date}</div>
                        <div class="history-summary">
                            <div><strong>Total Cash:</strong> $${entry.cash.toFixed(2)}</div>
                            <div><strong>Distributed:</strong> $${entry.totalDistributed.toFixed(2)}</div>
                            <div><strong>Servers:</strong> ${entry.servers} × $${entry.serverPay}</div>
                            <div><strong>Bussers:</strong> ${entry.bussers} × $${entry.busserPay}</div>
                            <div><strong>Hosts:</strong> ${entry.hosts} × $${entry.hostPay}</div>
                            <div><strong>Excess:</strong> $${entry.excess.toFixed(2)}</div>
                        </div>
                    </div>
                `;
            });

            historyList.innerHTML = historyHTML;
        }

        function deleteHistoryEntry(id) {
            if (confirm("Are you sure you want to delete this entry?")) {
                tipHistory = tipHistory.filter(entry => entry.id !== id);
                updateHistoryDisplay();
            }
        }

        // Export functionality
        document.getElementById("export-history").addEventListener("click", () => {
            if (tipHistory.length === 0) {
                alert("No history to export!");
                return;
            }

            // Create CSV content
            const headers = ["Date", "Total Cash", "Servers", "Server Pay", "Bussers", "Busser Pay", "Hosts", "Host Pay", "Total Distributed", "Excess"];
            const csvContent = [
                headers.join(","),
                ...tipHistory.map(entry => [
                    entry.date,
                    entry.cash.toFixed(2),
                    entry.servers,
                    entry.serverPay,
                    entry.bussers,
                    entry.busserPay,
                    entry.hosts,
                    entry.hostPay,
                    entry.totalDistributed.toFixed(2),
                    entry.excess.toFixed(2)
                ].join(","))
            ].join("\n");

            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tip_history_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        });

        // Formula modal
        document.getElementById("formula").addEventListener("click", () => {
            document.getElementById("formula-modal").style.display = "block";
        });