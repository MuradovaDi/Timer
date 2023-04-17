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

// "storage" functions
/*const getResultsFromLocalStorage = () => {
  const resultData = JSON.parse(localStorage.getItem(resultData)) || [];
  return resultData;
}; */

const storeResultInLocalStorage = () => {
  let resultData = [];
  let resultObj = {};
      resultObj.startDate = startDate.value;
      resultObj.endDate = endDate.value;
      resultObj.result = result.textContent;

  resultData.push(resultObj);
  localStorage.setItem(resultData, JSON.stringify(resultData));

  if(exceedsLengthLimit(resultData)) {
    resultData.shift();
  }
  function exceedsLengthLimit(resultData) {
       let limitLength = 10;
       let exceedsLimit = false;
       if(resultData.length > limitLength) {
           exceedsLimit = true;
       }
       return exceedsLimit;
  }
    
  // Відображення даних у таблиці
    let row;
    resultData.forEach((obj) => {
      row = document.createElement('tr'); 
      row.innerHTML = 
        `<td>${resultObj.startDate} - ${resultObj.endDate}</td>
        <td>${resultObj.result}</td>`;
      table.appendChild(row);
    })
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
  let setWeekDate = new Date(startDate.value);
  setWeekDate.setDate(setWeekDate.getDate() + 7);
  endDate.valueAsDate = setWeekDate;
  count.disabled = false;
})

presetMonth.addEventListener('click', () => {
  let setMonthDate = new Date(startDate.value);
  setMonthDate.setMonth(setMonthDate.getMonth() + 1);
  endDate.valueAsDate = setMonthDate;
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
})








