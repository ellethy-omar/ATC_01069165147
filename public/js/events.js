document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const list = document.getElementById('eventsList');
  const msg = document.getElementById('noEventsMsg');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  async function fetchEvents() {
    try {
      const res = await fetch('/api/events');
      const events = await res.json();
      if (!res.ok || !Array.isArray(events)) {
        throw new Error('Failed to load events');
      }

      if (events.length === 0) {
        msg.hidden = false;
        return;
      }

      for (const event of events) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h3>${event.title}</h3>
          <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
          <p><strong>Location:</strong> ${event.location || 'N/A'}</p>
          <button data-id="${event._id}" class="btn">View Details</button>
        `;
        list.appendChild(card);
      }

      // Click event listeners
      list.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          const eventId = e.target.getAttribute('data-id');
          localStorage.setItem('selectedEventId', eventId);
          window.location.href = 'event.html';
        }
      });
    } catch (err) {
      msg.hidden = false;
      msg.textContent = 'Error loading events.';
    }
  }

  fetchEvents();
});