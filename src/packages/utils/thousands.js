/**
 * Created by shli on 2018/11/12.
 */

export const comdify = value => {
  let n = value
  let re = /\d{1,3}(?=(\d{3})+$)/g
  let n1 = String(n).replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2) {
    return s1.replace(re, '$&,') + s2
  })
  return n1
}

export const delcommafy = n => {
  let value = n
  value = value.toString()
  value = value.replace(/,/gi, '')
  return value
}
