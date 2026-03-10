let threadId = null;

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const loadingIndicator = document.getElementById('loading-indicator');

document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerHTML = `<div class="message-content">${text.replace(/\n/g, '<br>')}</div>`;
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
}

function scrollToBottom() {
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;
    
    // Show loading
    loadingIndicator.classList.add('active');
    scrollToBottom();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                thread_id: threadId,
                message: text
            })
        });

        const data = await response.json();
        threadId = data.thread_id;
        
        loadingIndicator.classList.remove('active');
        
        if (data.response) {
            addMessage(data.response, 'assistant');
        }

        updateSummary(data);

    } catch (error) {
        loadingIndicator.classList.remove('active');
        addMessage('Sorry, an error occurred communicating with the server.', 'assistant');
        console.error(error);
    } finally {
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
}

function updateSummary(data) {
    // Update Requirements
    if (data.requirements && data.requirements.trip) {
        const reqDoc = data.requirements;
        let reqHtml = `
            <div class="req-item"><span class="req-label">Trip:</span> <div>${reqDoc.trip?.origin?.city || '?'} ➔ ${reqDoc.trip?.destination?.city || '?'} (${reqDoc.trip?.type || '?'})</div></div>
            <div class="req-item"><span class="req-label">Dates:</span> <div>${reqDoc.trip?.depart_date || '?'} to ${reqDoc.trip?.return_date || 'N/A'}</div></div>
            <div class="req-item"><span class="req-label">Travelers:</span> <div>${reqDoc.traveler?.adults || 1} Adults, ${reqDoc.traveler?.children || 0} Children</div></div>
            <div class="req-item"><span class="req-label">Budget:</span> <div>${reqDoc.budget?.total_amount || '?'} ${reqDoc.budget?.total_currency || ''}</div></div>
            <div class="req-item"><span class="req-label">Interests:</span> <div>${(reqDoc.preferences?.interests || []).join(', ')}</div></div>
        `;
        
        if (reqDoc.flight_check?.outbound_result?.top_option) {
            const topF = reqDoc.flight_check.outbound_result.top_option;
            reqHtml += `<div class="req-item"><span class="req-label">Flight:</span> <div>${topF.carrier} ${topF.flight_number} ($${topF.price_usd})</div></div>`;
        }
        document.getElementById('requirements-content').innerHTML = reqHtml;
        document.getElementById('requirements-content').style.color = '#e2e8f0';
    }

    // Update Itinerary
    if (data.itinerary && data.itinerary.days && data.itinerary.days.length > 0) {
        let itinHtml = '';
        data.itinerary.days.forEach(day => {
            itinHtml += `<div class="day-header">${day.date} - ${day.city}</div>`;
            day.activities.forEach(act => {
                itinHtml += `<div class="activity-item">${act.name} <em style="font-size:0.85em; opacity:0.6; margin-left:6px;">${act.type}</em></div>`;
            });
        });
        if (itinHtml) {
            document.getElementById('itinerary-content').innerHTML = itinHtml;
            document.getElementById('itinerary-content').style.color = '#e2e8f0';
        }
    }

    // Update Bookings
    if (data.bookings && (data.bookings.flights || data.bookings.hotels)) {
        let bookHtml = '';
        if (data.bookings.flights) {
            bookHtml += `<div class="booking-item">Flight Confirmed: ${data.bookings.flights.status} (#${data.bookings.flights.booking_id})</div>`;
        }
        if (data.bookings.hotels) {
            bookHtml += `<div class="booking-item">Hotel Confirmed: ${data.bookings.hotels.status} (#${data.bookings.hotels.booking_id})</div>`;
        }
        if (bookHtml) {
            document.getElementById('bookings-content').innerHTML = bookHtml;
        }
    }
}
