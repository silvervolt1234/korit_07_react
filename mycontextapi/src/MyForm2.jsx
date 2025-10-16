import { useState } from "react"

function MyForm2() {
  const [ text, setText ] = useState("");

  // input field에 입력한것을 submit할시 지울 수 있는 함수
  // const handleChange = (event) => {
  //   setText(event.target.value)
  //   console.log(text);
  // }

  const handleSubmit = (event) => {
    alert(`'${text}'라고 입력하셨습니다.`)
    event.preventDefault();
  }

  return(
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={event => setText(event.target.value)} value={text}/>
        <br />
        <br />
        <input type="submit" value="클릭하세요" />
      </form>
    </>
  )
}

export default MyForm2