async function checkKeys() {
    const skInput = document.getElementById('skInput').value.trim();
    if (!skInput) {
        alert('Please enter SK keys.');
        return;
    }

    const keys = skInput.split('\n').map(key => key.trim()).filter(key => key !== '');
    const liveResults = document.querySelector('.live-results');
    const deadResults = document.querySelector('.dead-results');
    const unknownResults = document.querySelector('.unknown-results');
    const liveCount = document.querySelector('.live-count');
    const dieCount = document.querySelector('.die-count');
    const unknownCount = document.querySelector('.unknown-count');

    liveResults.innerHTML = '';
    deadResults.innerHTML = '';
    unknownResults.innerHTML = '';
    liveCount.textContent = '0';
    dieCount.textContent = '0';
    unknownCount.textContent = '0';

    for (const skKey of keys) {
        try {
            const response = await fetch(`https://cors-bypasser-gilt.vercel.app/fetchdata?url=https://sk-checker.live/api/sk.php?sk=${skKey}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();

            if (text.includes('DEAD')) {
                addResult(deadResults, text, 'dead');
                dieCount.textContent = parseInt(dieCount.textContent) + 1;
            } else if (text.includes('LIVE')) {
                addResult(liveResults, text, 'live');
                liveCount.textContent = parseInt(liveCount.textContent) + 1;
            } else {
                addResult(unknownResults, text, 'unknown');
                unknownCount.textContent = parseInt(unknownCount.textContent) + 1;
            }
        } catch (error) {
            console.error('Error:', error);
            addResult(unknownResults, `Error checking key: ${skKey}`, 'unknown');
            unknownCount.textContent = parseInt(unknownCount.textContent) + 1;
        }
    }
}

function addResult(container, text, status) {
    const resultElement = document.createElement('div');
    resultElement.classList.add('alert', status === 'live' ? 'alert-success' : status === 'dead' ? 'alert-danger' : 'alert-warning');
    resultElement.innerHTML = text;
    container.appendChild(resultElement);
}
