export default function isInRange(range,date=new Date()) {
    const value = new Date().toTimeString()
    const serverDate = new Date()
    return  date.getUTCFullYear() === serverDate.getUTCFullYear() &&  date.getUTCMonth() === serverDate.getUTCMonth() && date.getUTCDate() === serverDate.getUTCDate() &&   value >= range[0] && value <= range[1];
  }


  export function isInRangeByDate(range,today) {
    const value = new Date().toTimeString()
    const serverDate = new Date()
    const date = new Date(
        today
    )

    console.log(date)
    return  date.getUTCFullYear() === serverDate.getUTCFullYear() &&  date.getUTCMonth() === serverDate.getUTCMonth() && date.getUTCDate() === serverDate.getUTCDate() &&   value >= range[0] && value <= range[1];
  }