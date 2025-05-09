document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const eventId = localStorage.getItem('selectedEventId');
  const titleEl = document.getElementById('eventTitle');
  const descEl  = document.getElementById('eventDesc');
  const dateEl  = document.getElementById('eventDate');
  const locEl   = document.getElementById('eventLocation');
  const capEl   = document.getElementById('eventCapacity');
  const btn     = document.getElementById('bookBtn');
  const errorEl = document.getElementById('eventError');

  if (!token || !eventId) {
    window.location.href = 'index.html';
    return;
  }

  async function loadEvent() {
    try {
      const res = await fetch(`/api/events/${eventId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error fetching event');

      titleEl.textContent = data.title;
      descEl.textContent  = data.description || 'No description.';
      dateEl.textContent  = new Date(data.date).toLocaleString();
      locEl.textContent   = data.location || 'N/A';
      capEl.textContent   = data.capacity;
    } catch (err) {
      titleEl.textContent = 'Event not found';
      errorEl.textContent = 'Could not load event.';
      btn.disabled = true;
    }
  }

  async function handleBooking() {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ eventId })
      });
      const data = await res.json();
      if (!res.ok) {
        errorEl.textContent = data.message || 'Booking failed';
        return;
      }
      
      window.location.href = 'congrats.html';
    } catch (err) {
      errorEl.textContent = 'Network error while booking';
    }
  }

  btn.addEventListener('click', handleBooking);
  loadEvent();
});
