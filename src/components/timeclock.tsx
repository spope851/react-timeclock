import React, { useState } from 'react'

export interface Clock {
  in:string
  out?:string | null
  accomplished?:string | null
}

const LOCAL_STORAGE_KEY = "react-timeclock"

const duration = (timeIn: string, timeOut: string) => {
  return ((new Date(timeOut).getTime() - new Date(timeIn).getTime())/1000/60/60).toFixed(2)
}

const timeFormat = (time: string) => new Date(time).toLocaleTimeString("en-US", { hour: 'numeric', minute: 'numeric' })

const THEAD_STYLES = { 
  backgroundColor: 'silver',
  borderTop: 'solid 2px darkgray',
  borderBottom: 'solid 2px darkgray',
}

const CLOCK_BTN_STYLES = {
  margin: 3,
  border: 'solid 2px blue',
  borderRadius: '4px',
  padding: 5
}

export const Timeclock: React.FC = () => {
  const updateStorage = (newData: Clock[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData))
    }
  }

  const [data, setData] = useState<Clock[]>(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"))
  const [accomplished, setAccomplished] = useState<string>()
  const [totalTime, setTotalTime] = useState(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]").map((d: Clock) => d.out ? duration(d.in, d.out) : '0').reduce((p: number, c: number) => Number(p) + Number(c), 0))

  const clockIn = () => {
    const clockIn: Clock = { in: new Date().toLocaleString('en-US') }
    const newData: Clock[] = [
      clockIn,
      ...data,
    ]
    setData(newData)
    updateStorage(newData)
  }
  
  const clockOut = () => {
    const clockOut: Clock = {
      in: data[0].in,
      out: new Date().toLocaleString('en-US'),
      accomplished: accomplished || ''
    }
    data.shift()
    const newData: Clock[] = [
      clockOut,
      ...data,
    ]
    setData(newData)
    updateStorage(newData)
    setAccomplished(undefined)
    setTotalTime((t: number) => clockOut.out ? t + Number(duration(clockOut.in, clockOut.out)) : t)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: `100vh`
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3
        }}
      >
        <table
          style={{
            margin: 25,
            borderCollapse: 'collapse',
            border: 'solid 2px darkgray',
          }}
        >
          <thead style={THEAD_STYLES}>
            <tr>
              <th style={{ padding: '10px 50px' }}>Total</th>
            </tr>
          </thead>
          <tbody style={{
            backgroundColor: 'whitesmoke',
            textAlign: 'center'
          }}>
            <tr>
              <td style={{ padding: 25 }}>{totalTime.toFixed(2)} hours</td>
            </tr>
          </tbody>
        </table>
        {data.length > 0
        ? (
          data[0].out
          ? <button 
              style={CLOCK_BTN_STYLES}
              type="button"
              onClick={clockIn}>Clock In</button>
          : <button
              style={CLOCK_BTN_STYLES}
              tabIndex={6}
              type="button"
              onClick={clockOut}
              disabled={!accomplished}>Clock Out</button>
              )
        : (
          <button 
            style={CLOCK_BTN_STYLES}
            type="button"
            onClick={clockIn}>Clock In</button>
          )}
      </div>
      <table
        style={{     
          display: 'block',
          overflow: 'auto'
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}
          className="animate__animated animate__zoomIn"
        >
          <thead style={THEAD_STYLES}>
            <tr>
              <th style={{ padding: 10 }}>Date</th>
              <th>IN</th>
              <th>OUT</th>
              <th>Duration</th>
              <th>Accomplished</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
          {data.length > 0 && data.map((time: Clock, idx) => (
              <tr 
                key={time.in} 
                style={{
                  backgroundColor: idx % 2 > 0 ? 'lightgray' : 'whitesmoke',
                  textAlign: 'center'
                }}
              >
                <td>{new Date(time.in).toLocaleDateString()}</td>
                <td>{timeFormat(time.in)}</td>
                <td>{time.out && timeFormat(time.out)}</td>
                <td>{time.out && `${duration(time.in, time.out)}`}</td>
                <td>
                  {time.out 
                   ? time.accomplished 
                   : <textarea
                        style={{
                          margin: 10,
                          width: '-webkit-fill-available'
                        }}
                        tabIndex={5}
                        className='animate__animated animate__lightSpeedInLeft'
                        placeholder='What did we accomplish?'
                        onChange={e => setAccomplished(e.target.value)} />}
                </td>
                <td>
                  {time.out && 
                      <button 
                        style={{
                          margin: 25,
                          border: 'solid 2px red',
                          borderRadius: '4px',
                          padding: '5px 10px'
                        }}
                        type="button"
                        onClick={() => {
                          setData(d => {
                            const newData = d.filter((_x, index) => index !== idx )
                            updateStorage(newData)
                            setTotalTime(newData.map(d => d.out ? duration(d.in, d.out) : '0').reduce((p, c) => Number(p) + Number(c), 0))
                            return newData
                          })
                        }}
                      >
                        x
                      </button>}
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </table>
    </div>
  )
}
