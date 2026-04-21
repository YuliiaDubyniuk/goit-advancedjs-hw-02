import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

const createPromise = (delay, state) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
};

form.addEventListener('submit', event => {
  event.preventDefault();

  // extract values from the form
  const delay = Number(form.elements.delay.value);
  const state = form.elements.state.value;

  // call the promise and handle the result
  createPromise(delay, state)
    .then(delay => {
      iziToast.success({
        title: '',
        message: `✅ Fulfilled promise in ${delay}ms`,
        icon: '',
        position: 'topRight',
      });
    })
    .catch(delay => {
      iziToast.error({
        title: '',
        message: `❌ Rejected promise in ${delay}ms`,
        icon: '',
        position: 'topRight',
      });
    });

  form.reset();
});
