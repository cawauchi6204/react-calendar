import {
  useEffect,
  useState
} from 'react'

const Calendar = () => {
  const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "STU"]
  const [calendar, setCalendar] = useState<number[][]>([])
  const [date, setDate] = useState(new Date())
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  useEffect(() => {
    showCalendar(date)
  }, [date])

  // 前の月表示
  const displayPrevMonth = (_date: Date) => {
    const prev_month_num = _date.getMonth() - 1
    const prev_month_date = _date.setMonth(prev_month_num)
    const prev_date = new Date(prev_month_date)
    setDate(prev_date)
  }

  // 当月表示
  const displayThisMonth = () => {
    const this_month = new Date()
    setDate(this_month)
  }

  // 次の月表示
  const displayNextMonth = (_date: Date) => {
    const next_month_num = _date.getMonth() + 1
    const next_month_date = _date.setMonth(next_month_num)
    const next_date = new Date(next_month_date)
    setDate(next_date)
  }

  // カレンダー表示
  const showCalendar = (_date: Date) => {
    const year = _date.getFullYear()
    const month = _date.getMonth()

    const calendar = createCalendar(year, month)
    setCalendar(calendar)
  }

  // カレンダー作成関数
  const createCalendar = (_year: number, _month: number) => {
    const calendar_array: number[][] = []
    let count = 0
    const start_day_of_week = new Date(_year, _month, 1).getDay()
    const end_date = new Date(_year, _month + 1, 0).getDate()
    const last_month_end_date = new Date(_year, _month, 0).getDate()
    const row = Math.ceil((start_day_of_week + end_date) / week.length)

    // 1行ずつ設定
    for (let i = 0; i < row; i++) {
      // 1colum単位で設定
      const column_array: number[] = []
      for (let j = 0; j < week.length; j++) {
        if (i === 0 && j < start_day_of_week) {
          // 1行目で1日まで先月の日付を設定
          const day = last_month_end_date - start_day_of_week + j + 1
          column_array.push(day)
        } else if (count >= end_date) {
          // 最終行で最終日以降、翌月の日付を設定
          count++
          column_array.push(count - end_date)
        } else {
          // 当月の日付を曜日に照らし合わせて設定
          count++
          column_array.push(count)
        }
      }
      calendar_array.push(column_array)
    }
    return calendar_array
  }
  return (
    <>
      <p>{year}年{month}月</p>
      <button onClick={() => { displayPrevMonth(date) }}>
        前月表示
      </button>
      <button onClick={() => { displayThisMonth() }}>
        当月表示
      </button>
      <button onClick={() => { displayNextMonth(date) }}>
        次月表示
      </button>
      <table>
        <thead>
          <tr>
            {
              week.map(_day => {
                return (
                  <th>
                    {_day}
                  </th>
                )
              })
            }
          </tr>
        </thead>
        <tbody>
          {
            calendar.map((week_row: number[], row_num: number) => (
              <tr key={row_num}>
                {
                  week_row.map(_date => (
                    <td>
                      {_date}
                    </td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  )
}
export default Calendar
