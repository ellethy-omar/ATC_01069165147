document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const list = document.getElementById('bookingList');
  const msg  = document.getElementById('noBookings');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  async function fetchBookings() {
    try {
      const res = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const bookings = await res.json();
      if (!res.ok || !Array.isArray(bookings)) throw new Error();

      if (bookings.length === 0) {
        msg.hidden = false;
        return;
      }

      bookings.forEach((booking) => {
        const ev = booking.event;
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
          <div>
            <strong>${ev.title}</strong><br>
            ${new Date(ev.date).toLocaleString()}<br>
            <em>${ev.location || 'No location'}</em>
          </div>
          <span class="info">✔ Booked</span>
        `;
        list.appendChild(div);
      });
    } catch {
      msg.hidden = false;
      msg.textContent = 'Failed to load bookings.';
    }
  }

  fetchBookings();
});