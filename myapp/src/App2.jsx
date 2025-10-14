import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(123)
  // count = 1;   상수이기에 오류 발생
  const [firstName, setFirstName] = useState('일');
  const [lastName, setLastName] = useState('김');

  return (
    <>
      <div>
        <p>{firstName}</p>
        <p>{lastName}</p>
        <a  target="_blank">
        </a>
        <a  target="_blank">
        </a>
      </div>
      <h1>React 수업을 시작합니다</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
