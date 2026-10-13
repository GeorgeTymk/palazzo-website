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
  if (departureInput.value && departureInput.value < departureInput.min) departureInput.value = '';
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
    if (!response.ok) throw new Error('The enquiry service did not accept the request.');
    bookingForm.reset();
    if (arrivalInput) arrivalInput.min = localToday;
    if (departureInput) departureInput.min = localToday;
    formStatus.textContent = 'Thank you. Your enquiry has been sent to The Palazzo Residence. Our team will follow up with you.';
  } catch (error) {
    formStatus.classList.add('error');
    formStatus.textContent = 'We could not send your enquiry just now. Please try again or contact us by email or WhatsApp.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalLabel;
  }
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
