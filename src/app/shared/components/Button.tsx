import './Button.css';

function Button(
  props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
) {
  return <button  className='button' {...props}></button>;
}

export default Button;
