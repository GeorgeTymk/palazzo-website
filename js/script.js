const navbar = document.getElementById('navbar');
const menu = document.querySelector('.menu');
const navigation = document.querySelector('.primary-nav');
const bookingForm = document.querySelector('.booking-form');
const formStatus = document.querySelector('.form-status');
const arrivalInput = bookingForm?.querySelector('[name="arrival"]');
const departureInput = bookingForm?.querySelector('[name="departure"]');

window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

menu?.addEventListener('click', () => {
  const open = navigation.classList.toggle('active');
  menu.setAttribute('aria-expanded', String(open));
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('active');
    menu?.setAttribute('aria-expanded', 'false');
  });
});

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
if (arrivalInput) arrivalInput.min = localToday;
if (departureInput) departureInput.min = arrivalInput?.value || localToday;
arrivalInput?.addEventListener('change', () => {
  if (!departureInput) return;
  departureInput.min = arrivalInput.value || localToday;
  if (departureInput.value && departureInput.value <= departureInput.min) departureInput.value = '';
});

bookingForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (arrivalInput?.value && departureInput?.value && departureInput.value <= arrivalInput.value) {
    formStatus.className = 'form-status error';
    formStatus.textContent = 'Please choose a departure date that is after your arrival date.';
    departureInput.focus();
    return;
  }

  const submitButton = bookingForm.querySelector('button[type="submit"]');
  const originalLabel = submitButton.textContent;
  formStatus.className = 'form-status';
  formStatus.textContent = 'Sending your enquiry…';
  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';

  try {
    const response = await fetch(bookingForm.action, {
      method: 'POST',
      body: new FormData(bookingForm),
      headers: { Accept: 'application/json' },
    });
    const result = await response.json();

    // FormSubmit can return HTTP 200 even when a form is not activated or a request fails.
    if (!response.ok || String(result.success).toLowerCase() !== 'true') {
      throw new Error(result.message || 'The enquiry could not be accepted.');
    }

    bookingForm.reset();
    if (arrivalInput) arrivalInput.min = localToday;
    if (departureInput) departureInput.min = localToday;
    formStatus.textContent = 'Thank you. Your enquiry has been sent to The Palazzo Residence. Our team will follow up with you.';
  } catch (error) {
    formStatus.classList.add('error');
    formStatus.textContent = error.message && !error.message.includes('Failed to fetch')
      ? `We could not confirm that your enquiry was sent: ${error.message} Please try again or contact us by email or WhatsApp.`
      : 'We could not confirm that your enquiry was sent. Please check your connection and try again, or contact us by email or WhatsApp.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalLabel;
  }
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
