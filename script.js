//Hey Adam or Darren. Figured you guys were the only ones who'd actually look into the code.
// The password is OceanSide. 

const PASSWORD = "OceanSide";
const POINTS_SERVER = 2, POINTS_BUSSER = 1, POINTS_HOST = 0.5;

const overlay = document.getElementById("overlay");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const errorText = document.getElementById("error");
const calculator = document.getElementById("calculator");

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
        </div>
    `;

    document.getElementById("results").innerHTML = resultsHTML;

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

document.getElementById("formula").addEventListener("click", () => {
    window.location.href = "formula.html";
});