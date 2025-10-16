import { useState } from "react"

function MyForm3() {
  const [ user, setUser ] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  // form에서 쓸거라 handleSubmit부터 작성
  const handleSubmit = (event) => {
    alert(`Hello, ${user.firstName} ${user.lastName}`);
    event.preventDefault();
  }

  // form 태그를 썻고 내부에 input으로 입력받을거니 onChange를 작성
  // 그런데 여러개의 input 태그 내에 onChange={event => setUser(event.target.value)}를 field 개수대로는 할 필요는 없기에
  const handleChange = (event) => {
    setUser({...user, [event.target.name]: event.target.value })
  }

  return(
    <>
      <form onSubmit={handleSubmit}>
        <label>First Name : </label>
        <input type="text" name="firstName" onChange={handleChange} value={user.firstName}/>
        <br />
        <label>Last Name : </label>
        <input type="text" name="lastName" onChange={handleChange} value={user.lastName}/>
        <br />
        <label>email : </label>
        <input type="text" name="email" onChange={handleChange} value={user.email}/>
        <br />
        <input type="submit" value="클릭하세요" />
      </form>
    </>
  )
}

export default MyForm3