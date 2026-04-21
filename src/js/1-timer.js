import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dateInputField = document.querySelector('#datetime-picker');
dateInputField.disabled = false;

const startBtn = document.querySelector('[data-start]');
startBtn.disabled = true;

let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    // ensure date is in future
    const selectedDateMs = selectedDates[0].getTime();
    if (selectedDateMs <= Date.now()) {
      iziToast.error({
        title: '',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
    } else {
      startBtn.disabled = false;
      userSelectedDate = selectedDateMs;
    }
  },
};

flatpickr(dateInputField, options);

const timer = {
  deadline: null,
  intervalId: null,
  refs: {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
  },

  start() {
    this.deadline = userSelectedDate;

    // Disable UI
    startBtn.disabled = true;
    dateInputField.disabled = true;

    // set interval to update timer data each second
    this.intervalId = setInterval(() => {
      const diff = this.deadline - Date.now();

      if (diff <= 0) {
        this.stop();

        return;
      }

      let { days, hours, minutes, seconds } = this.convertMs(diff);

      this.refs.days.textContent = this.pad(days);
      this.refs.hours.textContent = this.pad(hours);
      this.refs.minutes.textContent = this.pad(minutes);
      this.refs.seconds.textContent = this.pad(seconds);
    }, 1000);
  },

  stop() {
    clearInterval(this.intervalId);
    dateInputField.disabled = false;
  },

  // convert dates' difference in ms to data object
  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  },

  pad(value) {
    return String(value).padStart(2, '0');
  },
};

startBtn.addEventListener('click', () => {
  timer.start();
});
