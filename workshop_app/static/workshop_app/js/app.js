const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const bookingForm = document.getElementById('bookingForm');
const toast = document.getElementById('toast');

// This JS ensures all cards are rendered and modal/form logic works

document.addEventListener('DOMContentLoaded', function () {
  // Card data
  const workshops = [
    {
      title: "Python for Beginners",
      desc: "Kickstart your coding journey with hands-on Python sessions. No prior experience needed!",
      img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Data Science Bootcamp",
      desc: "Explore data analysis, visualization, and machine learning techniques with real-world projects.",
      img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Web Development Essentials",
      desc: "Build modern, responsive websites from scratch using HTML, CSS, and JavaScript.",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "AI & Machine Learning",
      desc: "Dive into artificial intelligence and machine learning with hands-on labs and expert mentors.",
      img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Cloud Computing Fundamentals",
      desc: "Learn the basics of cloud platforms, deployment, and scaling applications in the cloud.",
      img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "UI/UX Design Sprint",
      desc: "Master the art of user interface and experience design with creative, practical exercises.",
      img: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80"
    }
  ];

  // Render cards dynamically
  const cardsContainer = document.getElementById('cards');
  cardsContainer.innerHTML = '';
  workshops.forEach(w => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${w.img}" alt="${w.title}">
      <div class="card-content">
        <h3>${w.title}</h3>
        <p>${w.desc}</p>
        <button class="card-btn" onclick="openBooking('${w.title}')">Book Now</button>
      </div>
    `;
    cardsContainer.appendChild(card);
  });

  // Modal logic
  window.openBooking = function(workshopName) {
    document.getElementById('modal').setAttribute('aria-hidden', 'false');
    document.getElementById('modalTitle').textContent = 'Book: ' + workshopName;
    document.getElementById('workshopId').value = workshopName;
  };
  document.getElementById('closeModal').onclick = function() {
    document.getElementById('modal').setAttribute('aria-hidden', 'true');
  };
  document.getElementById('cancelBtn').onclick = function() {
    document.getElementById('modal').setAttribute('aria-hidden', 'true');
  };

  // Form validation and submission
  document.getElementById('bookingForm').onsubmit = function(e) {
    e.preventDefault();
    let valid = true;
    let form = e.target;
    // Validate required fields
    ['name', 'email', 'phone', 'courseLevel'].forEach(function(id) {
      let input = form[id];
      if (!input.value.trim()) {
        input.style.borderColor = '#ef4444';
        valid = false;
      } else {
        input.style.borderColor = '';
      }
    });
    // Email pattern
    let email = form.email.value.trim();
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      form.email.style.borderColor = '#ef4444';
      valid = false;
    }
    // Phone pattern
    let phone = form.phone.value.trim();
    if (phone && !/^[0-9]{7,15}$/.test(phone)) {
      form.phone.style.borderColor = '#ef4444';
      valid = false;
    }
    if (!valid) {
      showToast('Please fill all required fields correctly.');
      return false;
    }
    // Submit via fetch
    fetch('/workshop/book/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        college: form.college.value,
        workshopId: form.workshopId.value,
        courseLevel: form.courseLevel.value,
        interests: form.interests.value
      })
    })
    .then(res => res.json())
    .then(res => {
      showToast(res.message || 'Booking received!');
      if (res.success) {
        form.reset();
        document.getElementById('modal').setAttribute('aria-hidden', 'true');
      }
    });
    return false;
  };

  function showToast(msg) {
    var toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // Helper to get CSRF token
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
});
