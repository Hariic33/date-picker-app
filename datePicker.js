const input = document.getElementById('datepicker-input');
const container = document.getElementById('datepicker-container');
const calendar = document.getElementById('calendar');
const currentMonthYear = document.getElementById('current-month-year');
let selectedDate = null;
let currentDate = new Date();
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

document.getElementById('prev-month').addEventListener('click', () => updateCalendar(-1));
document.getElementById('next-month').addEventListener('click', () => updateCalendar(1));
input.addEventListener('click', showDatepicker);
document.addEventListener('click', handleDocumentClick);
const dateFormatDropdown = document.getElementById('date-format-dropdown');
dateFormatDropdown.addEventListener('change', displaySelectedDate);

function isDaySelected(day) {
    return selectedDate.getDate() === day && isSameDate(selectedDate, currentDate, day);
}

function isToday(day) {
    const today = new Date();
    return currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth() && day === today.getDate();
}

function showDatepicker() {
    const inputRect = input.getBoundingClientRect();
    container.style.display = 'block';
    container.style.top = inputRect.bottom + 'px';
    container.style.left = inputRect.left + 'px';
    renderCalendar();
}

function hideDatepicker() {
    container.style.display = 'none';
}

function renderCalendar() {
    currentMonthYear.textContent = currentDate.toLocaleString(undefined, { year: 'numeric', month: 'long' });
    calendar.innerHTML = dayNames.map(day => `<div class="day-label">${day}</div>`).join('');

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 0, 0);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    function createDayCell(day, isOtherMonth = false, isToday = false) {
        const dayCell = document.createElement('div');
        dayCell.textContent = day;
        dayCell.classList.add('day');
        if (isOtherMonth) {
            dayCell.classList.add('other-month', 'prev-next-month');
        }
        if (isToday) {
            dayCell.classList.add('today');
        }
        if (selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear()) {
            dayCell.classList.add('selected-day');
        }
        return dayCell;
    }

    const prevMonthDays = prevMonth.getDate() - firstDayOfMonth.getDay() + 1;
    const nextMonthDays = 6 - lastDayOfMonth.getDay();

    for (let i = prevMonthDays; i <= prevMonth.getDate(); i++) {
        const dayCell = createDayCell(i, true);
        dayCell.addEventListener('click', () => selectDate(new Date(prevMonth.getFullYear(), prevMonth.getMonth(), i)));
        calendar.appendChild(dayCell);
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const dayCell = createDayCell(i, false, isToday(i));
        dayCell.addEventListener('click', () => selectDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), i)));
        calendar.appendChild(dayCell);
    }

    for (let i = 1; i <= nextMonthDays; i++) {
        const dayCell = createDayCell(i, true);
        dayCell.addEventListener('click', () => selectDate(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i)));
        calendar.appendChild(dayCell);
    }
}

function selectDate(date) {
    selectedDate = currentDate = date;

    const dayCells = calendar.querySelectorAll('.day');
    dayCells.forEach(dayCell => {
        dayCell.classList.remove('selected-day');
        if (dayCell.textContent === date.getDate().toString()) {
            dayCell.classList.add('selected-day');
        }
    });

    input.value = date.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });

    hideDatepicker();
}

function formatSelectedDate(selectedDate, selectedFormat) {
    if (!selectedDate) return '';

    const formatOptions = {
        iso8601: { year: 'numeric', month: '2-digit', day: '2-digit' },
        short: { year: '2-digit', month: 'short', day: 'numeric' },
        medium: { year: '2-digit', month: 'long', day: 'numeric' },
        full: { weekday: 'long', year: '2-digit', month: 'long', day: 'numeric' },
        withtext: { day: 'numeric', month: 'long', year: 'numeric' },
    };

    let formattedDate = selectedDate.toLocaleDateString(undefined, formatOptions[selectedFormat] || { year: 'numeric', month: '2-digit', day: '2-digit' });

    return formattedDate;
}

function displaySelectedDate() {
    const selectedFormat = dateFormatDropdown.value;
    const formattedDate = formatSelectedDate(selectedDate, selectedFormat);

    if (selectedFormat === 'iso8601') {
        input.value = formattedDate.split('/').reverse().join('-');
    } else if (selectedFormat === 'withtext') {
        const parts = formattedDate.split(' ');
        input.value = `Day ${parts[0]} of ${parts[1]} in the year ${parts[2]}`;
    } else {
        input.value = formattedDate;
    }
}

function updateCalendar(monthDelta) {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthDelta, 1);
    renderCalendar();
}

function handleDocumentClick(event) {
    if (!container.contains(event.target) && event.target !== input) {
        hideDatepicker();
    }
}

showDatepicker();