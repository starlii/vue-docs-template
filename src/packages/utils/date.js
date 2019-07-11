/**
 * Created By shli on 2018/10/15
 */

/**
 * get the number of days so far this month
 * @param year
 * @param month
 * @returns {number}
 */
export const getMonthDays = (year, month) => {
  return new Date(year, month, 0).getDate()
}

/**
 * get the number of days from the last quarter to today
 * @param year
 * @param month
 * @returns {*}
 */
export const getLastQuarterMountsToToday = (year, month) => {
  return getQuarterMounts(year, month) + getQuarterMountsToToday(year, month)
}

/**
 * get the number of days from  the last Year to today
 * @param year
 * @param month
 * @returns {*}
 */
export const getLastYearMountsToToday = (year, month) => {
  return getLastYearMounts(year) + getYearMountsToToday(year, month)
}

/**
 * get the number of days in the last year
 * @param year
 * @returns {number}
 */
function getLastYearMounts(year) {
  return new Date(year, 2, 0).getDate() + 337
}

/**
 * get the number of days from this Year to today
 * @param year
 * @param month
 * @returns {number}
 */
export function getYearMountsToToday(year, month) {
  let days = 0
  if (month === 1) {
    days += new Date().getDate()
  } else {
    for (let i = 0; i < month - 1; i++) {
      days += new Date(year, i + 1, 0).getDate()
    }
    days += new Date().getDate()
  }
  return days
}

/**
 * Get the number of days in the last quarter
 * @param year
 * @param month
 * @returns {number}
 */
function getQuarterMounts(year, month) {
  const lastQuarter = getQuarter(month) - 1 ? getQuarter(month) - 1 : 4

  if (lastQuarter === 3 || lastQuarter === 4) return 92
  if (lastQuarter === 2) return 91

  return new Date(year, 2, 0).getDate() + 62
}

/**
 * For the beginning of the quarter to today the number of days
 * @param year
 * @param month
 * @returns {number}
 */
export function getQuarterMountsToToday(year, month) {
  if (monthInQuarter(month) === 1) {
    return new Date().getDate()
  } else if (monthInQuarter(month) === 2) {
    return new Date(year, month - 1, 0).getDate() + new Date().getDate()
  } else {
    return (
      new Date(year, month - 2, 0).getDate() +
      new Date(year, month - 1, 0).getDate() +
      new Date().getDate()
    )
  }
}

function monthInQuarter(month) {
  return month % 3
}

function getQuarter(month) {
  return month % 3 ? Math.ceil(month / 3) : month / 3
}

export const getlastTwoYearsMountsToToday = (year, month) => {
  return (
    getLastYearMounts(year - 1) +
    getLastYearMounts(year) +
    getYearMountsToToday(year, month)
  )
}
