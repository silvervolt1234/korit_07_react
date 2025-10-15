import { useState } from "react";

function MyComponent3() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  const increment = () => {
    setCount1(count1 + 1);    // 먼저 호출되니 상태가 바뀔때마다 리렌더링이 일어나야하는데
    setCount2(count2 + 1);    // 이것도 호출되고 나서 렌더링은 하나만 발생
  }

  return (
  <>
    <p> 현재 값 : {count1} | {count2} </p>
    <button onClick={increment}> 증가 </button>
  </>
)
}

export default MyComponent3