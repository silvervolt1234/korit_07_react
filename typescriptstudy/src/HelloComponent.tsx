import HelloProps from "./types/types"

function HelloComponent({ name, age } : HelloProps) {  // 객체 구조분해 주목
  return(
    <>
      Hello, {name}, you are {age} years old!
    </>
  )
}

export default HelloComponent