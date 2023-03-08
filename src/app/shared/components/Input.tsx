import './Input.css';


function Input(
  props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
) {
  return <input  className='input' {...props}></input>;
}

export default Input;
