'use strict';

// DOM Змінні
const startDate = document.querySelector('.start');
const endDate = document.querySelector('.end');
const presetWeek = document.querySelector('.preset-week');
const presetMonth = document.querySelector('.preset-month');
const daySelect = document.querySelector('.day-select');
const dimensionSelect = document.querySelector('.dimension-select');
const count = document.querySelector('.count');
const result = document.querySelector('.result');
const table = document.querySelector('.table-results');

// Змінні
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const HOUR_IN_MILLISECONDS = 60 * 60 * 1000;
const MINUTE_IN_MILLISECONDS = 60 * 1000;
const SECOND_IN_MILLISECONDS = 1000;

const STORAGE_KEY = 'results';

// "storage" functions
const getResultsFromLocalStorage = () => {
  const resultData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return resultData;
}; 

// Відображення даних у таблиці
const renderHistoryTable = () => {
  let resultData = getResultsFromLocalStorage();

  table.innerHTML = "";

  resultData.forEach((obj) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${obj.startDate} - ${obj.endDate}</td>
       <td>${obj.result}</td>`;
    table.appendChild(row);
  })
}; 

if (localStorage.getItem(STORAGE_KEY) !== null) {
  renderHistoryTable();
}

const storeResultInLocalStorage = () => {
  let resultData = getResultsFromLocalStorage();

  if (resultData.length >= 10) {
    resultData.shift();
  }

  resultData.push({
    startDate: startDate.value,
    endDate: endDate.value,
    result: result.textContent
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resultData));
};

// Формат кінцевої дати
startDate.addEventListener('change', (event) => {
  endDate.removeAttribute('disabled');
  endDate.setAttribute('min', startDate.value);
})

count.disabled = true;
endDate.addEventListener('change', (event) => {
  count.disabled = false;
})

// Presets
presetWeek.addEventListener('click', () => {
  let weekPreset = new Date(startDate.value);
  weekPreset.setDate(weekPreset.getDate() + 7);
  endDate.valueAsDate = weekPreset;
  count.disabled = false;
})

presetMonth.addEventListener('click', () => {
  let monthPreset = new Date(startDate.value);
  monthPreset.setMonth(monthPreset.getMonth() + 1);
  endDate.valueAsDate = monthPreset;
  count.disabled = false;
})

// Day of week selection functions
function isWeekend(date) {
  let dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
}

function getWorkdaysCount() {
    let workdays = 0; 
    let curDate = new Date(startDate.value);
    while (curDate < new Date(endDate.value)) {
        if (!isWeekend(curDate)) workdays++;
        curDate.setDate(curDate.getDate() + 1);
    }
    return workdays * DAY_IN_MILLISECONDS;
}

function getWeekendsCount() {
    let weekends = 0;
    let curDate = new Date(startDate.value);
    while (curDate < new Date(endDate.value)) {
        if (isWeekend(curDate)) weekends++;
        curDate.setDate(curDate.getDate() + 1);
    }
    return weekends * DAY_IN_MILLISECONDS;
}

// Розрахунок

count.addEventListener('click', () => {
  function durationBetweenDates() {
    endDate.valueAsDate.setHours(0, 0, 0);
    startDate.valueAsDate.setHours(0, 0, 0);
    const start = Date.parse(startDate.valueAsDate);
    const end = Date.parse(endDate.valueAsDate);

    let dayDiff;
    if (daySelect.value == 'all'){
      dayDiff = end - start;
    } else if (daySelect.value == 'weekdays') {
      dayDiff = getWorkdaysCount();
    } else {
      dayDiff = getWeekendsCount();
    };
    
    let outcome;

    switch (dimensionSelect.value) {
      case 'days':
        outcome = dayDiff / DAY_IN_MILLISECONDS;
        break;
      case 'hours':
        outcome = dayDiff / HOUR_IN_MILLISECONDS;
        break;
      case 'minutes':
        outcome = dayDiff / MINUTE_IN_MILLISECONDS;
        break;
      case 'seconds':
        outcome = dayDiff / SECOND_IN_MILLISECONDS;
        break;
    };

    return `${outcome} ${dimensionSelect.value}`
  };

result.textContent = `Result: ${durationBetweenDates()}`;
storeResultInLocalStorage();

renderHistoryTable();
})








