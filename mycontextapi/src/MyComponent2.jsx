function MyComponent2() {
  // 버튼을 누르면 호출되는 함수 정의
  const handleClick = () => {
    alert ('Button pressed!');
  }

  return (
    <>
      <button onClick={handleClick}>Press Me!</button>
    </>
  )
}

export default MyComponent2