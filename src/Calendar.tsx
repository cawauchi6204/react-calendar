import {
  useCallback,
  useEffect,
  useState
} from 'react'
import {
  Box,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core'

type Plan = {
  calendar_id: number,
  day: number,
  plans?: [
    PlanDescription
  ]
}

type PlanDescription = {
  plan_id: number
  plan_title: string,
  plan_date: Date | number,
  plan_color: string
  [key: string]: any
}

const Calendar = () => {
  const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "STU"]
  const [calendar, setCalendar] = useState<Plan[][]>([])
  const [is_modal_open, setIsModalOpen] = useState(false)
  const [form_calendar_id, setFormCalendarId] = useState<number | undefined>()
  const [form_plan_title, setFormPlanTitle] = useState<string | undefined>()
  const [form_plan_date, setFormPlanDate] = useState<number | Date | undefined>()
  const [form_plan_color, setFormPlanColor] = useState<string | undefined>()
  const [date, setDate] = useState(new Date())
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  useEffect(() => {
    createCalendar(year, month)
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

  const openPlanDescription = (_plan: Plan) => {
    setFormPlanDate(_plan.day)
    setFormCalendarId(_plan.calendar_id)
    setIsModalOpen(true)
  }

  const closePlanDescription = () => {
    setFormPlanTitle(undefined)
    setFormPlanDate(undefined)
    setFormPlanColor(undefined)
    setIsModalOpen(false)
  }

  const addPlanDescription = (
    _calendar: Plan[][],
    _calendar_id: number,
    _plan_title: string,
    _plan_date: number | Date,
    _plan_color: string
  ) => {
    // 二次元配列を一次元配列にならす
    const list = _calendar.reduce((pre, current) => {
      pre.push(...current)
      return pre
    }, [])
    const item = list.find(_item => _item.calendar_id === _calendar_id)
    const plan_id = (item && item.plans) ? item.plans.length + 1 : 1
    if (item && plan_id) {
      const plan_description: PlanDescription = {
        plan_id,
        plan_title: _plan_title,
        plan_date: _plan_date,
        plan_color: _plan_color
      }
      if (!item.plans) {
        item.plans = [plan_description]
      } else {
        item.plans.push(plan_description)
      }
      setCalendar(_calendar)
    } else {
      throw new Error('plan_id is undefined')
    }
  }

  // カレンダー表示
  const displayCalendar = useCallback((_calendar: Plan[][]) => {
    return (
      _calendar.map((_week_row: Plan[], _row_num: number) => (
        <TableRow key={_row_num}>
          {
            _week_row.map(_date => (
              <TableCell
                style={{
                  border: '1px solid black',
                  cursor: 'pointer'
                }}
                onClick={() => { openPlanDescription(_date) }}
                key={_date.calendar_id}
              >
                {_date.day}
                {_date.plans?.map((_plan, _index: number) => (
                  <p style={{ color: _plan.plan_color }} key={_index}>{_plan.plan_title}</p>
                ))}
              </TableCell>
            ))
          }
        </TableRow>
      )
      ))
  }, [calendar])

  // カレンダー作成関数
  const createCalendar = (_year: number, _month: number) => {
    const calendar_array: Plan[][] = []
    let count = 0
    let calendar_id = 1
    const start_day_of_week = new Date(_year, _month, 1).getDay()
    const end_date = new Date(_year, _month + 1, 0).getDate()
    const last_month_end_date = new Date(_year, _month, 0).getDate()
    const row = Math.ceil((start_day_of_week + end_date) / week.length)

    // 1行ずつ設定
    for (let i = 0; i < row; i++) {
      // 1colum単位で設定
      const column_array: Plan[] = []
      for (let j = 0; j < week.length; j++) {
        if (i === 0 && j < start_day_of_week) {
          // 1行目で1日まで先月の日付を設定
          const day = last_month_end_date - start_day_of_week + j + 1
          const today_plan: Plan = {
            calendar_id,
            day,
          }
          calendar_id++
          column_array.push(today_plan)
        } else if (count >= end_date) {
          // 最終行で最終日以降、翌月の日付を設定
          count++
          const day = count - end_date
          const today_plan: Plan = {
            calendar_id,
            day,
          }
          calendar_id++
          column_array.push(today_plan)
        } else {
          // 当月の日付を曜日に照らし合わせて設定
          count++
          const day = count
          const today_plan: Plan = {
            calendar_id,
            day,
          }
          calendar_id++
          column_array.push(today_plan)
        }
      }
      calendar_array.push(column_array)
    }
    setCalendar(calendar_array)
  }

  const PlanDescriptionForm = () => (
    <Box
      style={{
        backgroundColor: 'white',
        width: '80%',
        margin: '0 auto',
        textAlign: 'center',
        verticalAlign: 'middle',
        padding: '5% 0'
      }}
    >
      <form>
        <TextField
          required
          label="タイトルと日時を追加"
          name="plan_title"
          onBlur={(_e: any) => {
            setFormPlanTitle(_e.target.value)
          }}
          value={form_plan_title}
        />
        <p>日時</p>
        <TextField
          label="時刻"
          type="time"
          defaultValue="09:00"
          inputProps={{
            step: 300,
          }}
          onChange={(_e: any) => {
            setFormPlanDate(_e.target.value)
          }}
          value={form_plan_date}
        />
      </form>
      <p>ラベルの色</p>
      <input
        type="color"
        onChange={(_e: any) => {
          setFormPlanColor(_e.target.value)
        }}
        value={form_plan_color}
      />
      <br />
      <Button
        variant="outlined"
        color="primary"
        onClick={
          (_e) => {
            _e.preventDefault()
            if (form_calendar_id && form_plan_title && form_plan_date && form_plan_color) {
              addPlanDescription(
                calendar,
                form_calendar_id,
                form_plan_title,
                form_plan_date,
                form_plan_color
              )
            }
            closePlanDescription()
          }}
      >
        登録する
      </Button>
    </Box>
  )

  return (
    <>
      <p>{year}年{month}月</p>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => { displayPrevMonth(date) }}
      >
        前月表示
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => { displayThisMonth() }}
      >
        当月表示
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => { displayNextMonth(date) }}
      >
        次月表示
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#F2F2F2" }}>
              {
                week.map((_day: string, _column_num: number) => {
                  return (
                    <TableCell key={_column_num} style={{ border: '1px solid black' }}>
                      {_day}
                    </TableCell>
                  )
                })
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {displayCalendar(calendar)}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={is_modal_open}
        onClose={() => closePlanDescription()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{
          width: '60%',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <PlanDescriptionForm />
      </Modal>
    </>
  )
}
export default Calendar
