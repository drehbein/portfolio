// Future directions:
// - JSDate methods should return early before creating any Date objects.
// - Alert when choosing future dates to agknowledge potential future holidays.
// - Use subclasses to avoid repitition in object constructors.
// - Output verifying the input should be based on date object rather than input string.
//    - This would highlight inputs like February 31 auto-correcting to March.

/**
 * Represents a repeating holiday defined by a single date.
 * @class
 * @param {string} name - Name of holiday.
 * @param {number} month - Month the holiday occurs; Zero-based.
 * @param {number} dayOfMonth - Date the holiday occurs.
 * @param {number} startYear - Year of first occurrence.
 * @param {number} endYear - Year of last occurrence.
 */
class FixedDate {
  constructor(
    name,
    month,
    dayOfMonth,
    startYear,
    endYear = Infinity
  ) {
    this.name = name;
    this.month = month;
    this.dayOfMonth = dayOfMonth;
    this.startYear = startYear;
    this.endYear = endYear; 
  }

  makeJSDate (year) {
    const JSDate = new Date(Date.UTC(year, this.month, this.dayOfMonth));

    if (
      JSDate.getUTCFullYear() < this.startYear ||
      JSDate.getUTCFullYear() > this.endYear
    ) {
      return null;
    }

    return JSDate;
  }
}

/**
 * Represents a repeating holiday defined by the nth
 * instance of a day of the week from the start of the month.
 * @class
 * @param {string} name - Name of holiday.
 * @param {number} month - Month the holiday occurs; Zero-based.
 * @param {number} dayOfWeek - Week day the holiday occurs; 0 = Sunday.
 * @param {number} nthInstance - Which instance of that weekday; Zero-based.
 * @param {number} startYear - Year of first occurrence.
 * @param {number} endYear - Year of last occurrence.
 */
class NthDayFromStart {
  constructor(
    name,
    month,
    dayOfWeek,
    nthInstance,
    startYear,
    endYear = Infinity
  ) {
    this.name = name;
    this.month = month;
    this.dayOfWeek = dayOfWeek;
    this.nthInstance = nthInstance;
    this.startYear = startYear;
    this.endYear = endYear; 
  }

  makeJSDate (year) {
    const dayOfFirst = new Date (Date.UTC(year, this.month, 1)).getUTCDay();
    const dateOfFirstInstance = (this.dayOfWeek - dayOfFirst + 7) % 7 + 1;
    const dateOfDesiredInstance = dateOfFirstInstance + 7 * this.nthInstance;

    const JSDate = new Date(Date.UTC(year, this.month, dateOfDesiredInstance));

    if (
      JSDate.getUTCFullYear() < this.startYear ||
      JSDate.getUTCFullYear() > this.endYear
    ) {
      return null;
    }

    return JSDate;
  }
}

/**
 * Represents a repeating holiday defined by the nth
 * instance of a day of the week from the end of the month.
 * @class
 * @param {string} name - Name of holiday.
 * @param {number} month - Month the holiday occurs; Zero-based.
 * @param {number} dayOfWeek - Week day the holiday occurs; 0 = Sunday.
 * @param {number} nthInstance - Which instance of that weekday; Zero-based.
 * @param {number} startYear - Year of first occurrence.
 * @param {number} endYear - Year of last occurrence.
 */
class NthDayFromEnd {
  constructor(
    name,
    month,
    dayOfWeek,
    nthInstance,
    startYear,
    endYear = Infinity
  ) {
    this.name = name;
    this.month = month;
    this.dayOfWeek = dayOfWeek;
    this.nthInstance = nthInstance;
    this.startYear = startYear;
    this.endYear = endYear; 
  }

  makeJSDate (year) {
    const lastDay = new Date(Date.UTC(year, this.month + 1, 0));
    const dayOfLast = lastDay.getUTCDay();
    const dateOfLast = lastDay.getUTCDate();
    const dateOfLastInstance = dateOfLast - (dayOfLast - this.dayOfWeek + 7) % 7;
    const dateOfDesiredInstance = dateOfLastInstance - 7 * this.nthInstance;

    const JSDate = new Date(Date.UTC(year, this.month, dateOfDesiredInstance));

    if (
      JSDate.getUTCFullYear() < this.startYear ||
      JSDate.getUTCFullYear() > this.endYear
    ) {
      return null;
    }

    return JSDate;
  }
}


// Calculates the quantity of business days between two dates
function main () {

  // Initializing input
  const startDateStr = document.querySelector('#startDate').value;
  const endDateStr = document.querySelector('#endDate').value;

  // Checks input against 'YYYY-MM-DD'
  const regex = /^\d{4}-(0[1-9]|1[012])-([0-2][0-9]|3[01])$/;
  if (!regex.test(startDateStr) || !regex.test(endDateStr)) {
    alert('Start and end dates must follow YYYY-MM-DD format.');
    return;
  }

  // Convert input into Date object
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // Abort invalid cases
  if (startDate >= endDate) {
    alert('Start date must be before end date.');
    return;
  } else if (startDate.getUTCFullYear() < 1971) {
    alert(
      'Federal holiday observances change over time. ' +
      'This calculator is invalid prior to 1971 due to ' +
      'the Uniform Monday Holiday Act of 1968.'
    );
    return;
  }

  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

  const weekendDays = calculateWeekendDays(startDate, totalDays);

  const observedHolidays = calculateObservedHolidays(startDate, endDate);

  const businessDays = totalDays - weekendDays - observedHolidays;

  // Display output
  document.querySelector('#summary').innerHTML =
    `Submitted ` +
    `${startDateStr.substring(5, 7)}` +
    `/${startDateStr.substring(8, 10)}` +
    `/${startDateStr.substring(0, 4)}` +
    ` to ` +
    `${endDateStr.substring(5, 7)}` +
    `/${endDateStr.substring(8, 10)}` +
    `/${endDateStr.substring(0, 4)}`;
  document.querySelector('#totalDays').innerHTML = totalDays;
  document.querySelector('#weekendDays').innerHTML = weekendDays;
  document.querySelector('#observedHolidays').innerHTML = observedHolidays;
  document.querySelector('#businessDays').innerHTML = businessDays;
}

// Calculates the quantity of weekend days from a start date and range length
function calculateWeekendDays (startDate, totalDays) {
  let dayOfWeek = startDate.getUTCDay();
  let remainingDays = 0;
  for (let i = 0; i < (totalDays % 7); i++) {
    dayOfWeek = (dayOfWeek + 1) % 7;
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      remainingDays ++;
    }
  }

  const weekendDays = Math.floor(totalDays / 7) * 2 + remainingDays;

  return weekendDays;
}

// Calculate quantity of observed holidays
function calculateObservedHolidays (startDate, endDate) {

  const federalHolidays = [
    new FixedDate('New Year\'s Day', 0, 1, 1885),
    new NthDayFromStart('Birthday of Martin Luther King, Jr.', 0, 1, 2, 1986),
    new NthDayFromStart('Washington\'s Birthday', 1, 1, 2, 1885),
    new NthDayFromEnd('Memorial Day', 4, 1, 0, 1971),
    new FixedDate('Juneteenth', 5, 19, 2021),
    new FixedDate('Independence Day', 6, 4, 1938),
    new NthDayFromStart('Labor Day', 8, 1, 0, 1894),
    new NthDayFromStart('Columbus Day', 9, 1, 1, 1971),
    new NthDayFromStart('Veteran\'s Day', 9, 1, 3, 1971, 1977),
    // Veteran's day changed due to Public Law 94-97
    new FixedDate('Veteran\'s Day', 10, 11, 1978),
    new NthDayFromStart('Thanksgiving Day', 10, 4, 3, 1942),
    new FixedDate('Christmas Day', 11, 25, 1885)
  ];

  const startYear = startDate.getUTCFullYear();
  const endYear = endDate.getUTCFullYear();

  let observedCount = 0;
  for (let year = startYear - 1; year <= endYear + 1; year++) {
    for (let i = 0; i < federalHolidays.length; i++) {
      const instanceDate = federalHolidays[i].makeJSDate(year);
      if (instanceDate instanceof Date) {
        // Bank holidays that fall on weekends are
        // observed on the nearest weekday
        const dayOfWeek = instanceDate.getUTCDay();
        let shift = dayOfWeek === 6 ? -1 : dayOfWeek === 0 ? 1 : 0;
        instanceDate.setUTCDate(instanceDate.getUTCDate() + shift);

        if (instanceDate > startDate && instanceDate <= endDate) {
          observedCount ++;
        }
      }
    }
  }

  return observedCount;
}

main();