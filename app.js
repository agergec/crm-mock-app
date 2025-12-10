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
    urlParams.forEach((value, key) => {
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
}
