import React from 'react';
import s from './Button.module.scss';

export interface ButtonProps {
  color?: 'dark' | 'light' | 'red',
  size?: 'lg' | 'm' | 's',
  type?: 'submit',
  weight?: string,
  value?: string,
  className?: string,
  width?: string,
  onClick?(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
};

const Button:React.FunctionComponent<ButtonProps> = ({color, onClick, children, size, type, value, className = '', width='auto'}) => {
  if(type === 'submit')
    return (
      <input
        type="submit"
        className={`${className} ${s.button} ${color ? s[color] : ''} ${size ? s[size] : ''} `}
        style={{width: width}}
        value={value}
      />
    )

  return (
    <button
      onClick={onClick}
      className={`${className} ${s.button} ${color ? s[color] : ''} ${size ? s[size] : ''} `}
      style={{width: width}}
    >
      { children }
    </button>
  )
}

export default Button;