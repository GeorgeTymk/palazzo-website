const navbar = document.getElementById('navbar');
const menu = document.querySelector('.menu');
const navigation = document.querySelector('.primary-nav');
const bookingForm = document.querySelector('.booking-form');
const formStatus = document.querySelector('.form-status');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

menu.addEventListener('click', () => {
  const open = navigation.classList.toggle('active');
  menu.setAttribute('aria-expanded', String(open));
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('active');
    menu.setAttribute('aria-expanded', 'false');
  });
});

bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = bookingForm.querySelector('button[type="submit"]');
  const originalLabel = submitButton.textContent;

  formStatus.className = 'form-status';
  formStatus.textContent = 'Sending your reservation request…';
  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';

  try {
    const response = await fetch(bookingForm.action, {
      method: 'POST',
      body: new FormData(bookingForm),
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) throw new Error('The reservation service did not accept the request.');

    bookingForm.reset();
    formStatus.textContent = 'Thank you — your reservation request has been sent to Palazzo.';
  } catch (error) {
    formStatus.classList.add('error');
    formStatus.textContent = 'We could not send your request. Please check your internet connection and try again.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalLabel;
  }
});

const galleryTrack = document.querySelector(".gallery-track");

if (galleryTrack) {

    galleryTrack.innerHTML += galleryTrack.innerHTML;

}
