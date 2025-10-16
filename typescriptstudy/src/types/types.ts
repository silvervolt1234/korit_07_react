type HelloProps = {
  name: string;     // Java에서의 field와 유사
  age: number;
  fn?: () => void;   // Java의 method와 유사
  fn2?: (meg: string) => void; // 매개변수로 string dat를 받고 return 타입 x
}

export default HelloProps

// 여기에 모든 type들을 모아두는 편