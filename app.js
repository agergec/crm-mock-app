document.addEventListener('DOMContentLoaded', () => {
    renderQueryParams();
});

function renderQueryParams() {
    const paramsBody = document.getElementById('params-body');
    const emptyState = document.getElementById('empty-state');
    const paramTable = document.getElementById('param-table');

    // Get query string from URL (e.g., ?foo=bar&baz=qux)
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Check if we have any parameters
    if (urlParams.toString() === "") {
        if (paramTable) paramTable.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    // Hide empty state, show table
    if (emptyState) emptyState.style.display = 'none';
    if (paramTable) paramTable.style.display = 'table';

    // Clear existing rows
    paramsBody.innerHTML = '';

    // Iterate over parameters
    let userQry = null;
    let userQryTxt = null;

    urlParams.forEach((value, key) => {
        if (key === 'user_qry') userQry = value;
        if (key === 'user_qry_txt') userQryTxt = value;

        const row = document.createElement('tr');

        const keyCell = document.createElement('td');
        keyCell.className = 'key-col';
        keyCell.textContent = key;

        const valueCell = document.createElement('td');
        valueCell.className = 'value-col';
        valueCell.textContent = value;

        row.appendChild(keyCell);
        row.appendChild(valueCell);
        paramsBody.appendChild(row);
    });

    if (userQry || userQryTxt) {
        const incomingParamsCard = document.getElementById('incoming-params-card');
        if (incomingParamsCard) {
            incomingParamsCard.style.display = 'none';
        }
        loadUser(userQry, userQryTxt);
    }
}

async function loadUser(userQry, userQryTxt) {
    const userDetailsCard = document.getElementById('user-details-card');
    const userDetailsContent = document.getElementById('user-details-content');

    try {
        const response = await fetch('people.json');
        if (!response.ok) {
            console.error('Failed to load people.json');
            return;
        }
        const people = await response.json();

        let foundUser = null;
        if (userQry) {
            // id is a number in json, but param is string
            foundUser = people.find(p => p.id == userQry);
        } else if (userQryTxt) {
            foundUser = people.find(p => p.id_txt === userQryTxt);
        }

        if (foundUser) {
            userDetailsContent.innerHTML = `
                <div class="user-info">
                    <div class="user-main-details">
                        <p><strong>Name:</strong> ${foundUser.name}</p>
                        <p><strong>Username:</strong> ${foundUser.username}</p>
                        <p><strong>Email:</strong> ${foundUser.email}</p>
                        <p><strong>Phone:</strong> ${foundUser.phone}</p>
                        <p><strong>Website:</strong> ${foundUser.website}</p>
                    </div>
                    
                    <div class="nested-box company-box">
                        <h3>Company</h3>
                        <p><strong>Name:</strong> ${foundUser.company.name}</p>
                        <p><strong>Catch Phrase:</strong> ${foundUser.company.catchPhrase}</p>
                        <p><strong>BS:</strong> ${foundUser.company.bs}</p>
                    </div>

                    <div class="nested-box address-box">
                        <h3>Address</h3>
                        <p>${foundUser.address.street}</p>
                        <p>${foundUser.address.suite}</p>
                        <p>${foundUser.address.city}, ${foundUser.address.zipcode}</p>
                    </div>
                </div>
            `;
            userDetailsCard.style.display = 'block';
        } else {
            userDetailsContent.innerHTML = `<p class="error">User not found.</p>`;
            userDetailsCard.style.display = 'block';
        }

    } catch (error) {
        console.error('Error fetching or parsing people.json:', error);
    }
}
