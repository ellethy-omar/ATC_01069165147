document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const list  = document.getElementById('adminEventsList');
  const form  = document.getElementById('createEventForm');
  const error = document.getElementById('createError');
  const msg   = document.getElementById('noAdminEvents');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  async function fetchEvents() {
    try {
      const res = await fetch('/api/events');
      const events = await res.json();
      if (!res.ok || !Array.isArray(events)) throw new Error();

      list.innerHTML = '';
      if (events.length === 0) {
        msg.hidden = false;
        return;
      }

      msg.hidden = true;
      events.forEach(ev => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
          <div>
            <strong>${ev.title}</strong><br>
            ${new Date(ev.date).toLocaleString()}
          </div>
          <button class="btn small danger" data-id="${ev._id}">Delete</button>
        `;
        list.appendChild(div);
      });
    } catch {
      msg.hidden = false;
      msg.textContent = 'Failed to load events';
    }
  }

  async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchEvents();
      else alert('Could not delete event');
    } catch {
      alert('Network error while deleting event');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      title:      form.title.value.trim(),
      description: form.description.value.trim(),
      date:       form.date.value,
      location:   form.location.value.trim(),
      capacity:   parseInt(form.capacity.value)
    };

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        error.textContent = data.message || 'Failed to create event';
        return;
      }

      form.reset();
      error.textContent = '';
      fetchEvents();
    } catch {
      error.textContent = 'Network error while creating event';
    }
  });

  list.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const id = e.target.getAttribute('data-id');
      deleteEvent(id);
    }
  });

  fetchEvents();
});
