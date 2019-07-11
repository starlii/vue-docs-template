/**
 * Created By shli on 2018/10/15
 */

/**
 * setting pickDate components value
 * @param picker
 * @returns {Function}
 */
export const getShortcuts = picker => {
  return (startDay, endDays = 0) => {
    const start = new Date()
    const end = new Date()

    start.setTime(start.getTime() - 3600 * 1000 * 24 * startDay)
    end.setTime(end.getTime() - 3600 * 1000 * 24 * endDays)
    picker.$emit('pick', [start, end])
  }
}

/**
 *
 * @param startDays
 * @param endDays
 * @returns {*[]}
 */
export const getStartAndEndTime = (startDays, endDays) => {
  const start = new Date()
  const end = new Date()

  start.setTime(start.getTime() - 3600 * 1000 * 24 * startDays)
  end.setTime(end.getTime() - 3600 * 1000 * 24 * endDays)

  return [start, end]
}
