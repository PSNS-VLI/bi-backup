import moment from 'moment'

const dateFormat = (data, pretype) => {
  return moment(new Date(data).getTime()).format(pretype)
}
export { dateFormat }
