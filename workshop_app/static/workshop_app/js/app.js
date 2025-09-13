const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const bookingForm = document.getElementById('bookingForm');
const toast = document.getElementById('toast');


document.addEventListener('DOMContentLoaded', function () {
 const workshops = [
    {
      title: "Python for Beginners",
      desc: "Kickstart your coding journey with hands-on Python sessions. No prior experience needed!",
      img: "/static/workshop_app/img/workshop_images/python_courses.png"
    },
    {
      title: "Data Science Bootcamp",
      desc: "Explore data analysis, visualization, and machine learning techniques with real-world projects.",
      img: "/static/workshop_app/img/workshop_images/datasci.png"
    },
    {
      title: "Web Development Essentials",
      desc: "Build modern, responsive websites from scratch using HTML, CSS, and JavaScript.",
      img: "/static/workshop_app/img/workshop_images/web.png"
    },
    {
      title: "AI & Machine Learning",
      desc: "Dive into artificial intelligence and machine learning with hands-on labs and expert mentors.",
      img: "/static/workshop_app/img/workshop_images/ai.png"
    },
    {
      title: "Cloud Computing Fundamentals",
      desc: "Learn the basics of cloud platforms, deployment, and scaling applications in the cloud.",
      img: "/static/workshop_app/img/workshop_images/cloud.png"
    },
    {
      title: "UI/UX Design Sprint",
      desc: "Master the art of user interface and experience design with creative, practical exercises.",
      img: "/static/workshop_app/img/workshop_images/ui.png"
    }
  ];

  const cardsContainer = document.getElementById('cards');
  cardsContainer.innerHTML = '';
  workshops.forEach(w => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${w.img}" alt="${w.title}" class="card-symbol">
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
    ['name', 'email', 'phone', 'courseLevel'].forEach(function(id) {
      let input = form[id];
      if (!input.value.trim()) {
        input.style.borderColor = '#ffb86b';
        valid = false;
      } else {
        input.style.borderColor = '';
      }
    });
    let email = form.email.value.trim();
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      form.email.style.borderColor = '#ffb86b';
      valid = false;
    }
    let phone = form.phone.value.trim();
    if (phone && !/^[0-9]{7,15}$/.test(phone)) {
      form.phone.style.borderColor = '#ffb86b';
      valid = false;
    }
    if (!valid) {
      showToast('Please fill all required fields correctly.');
      return false;
    }
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
