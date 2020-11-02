import React from 'react';
import { names } from "../Components";
import './Button.css';


const Button = ({ onClick, text, className, ...otherProps }) => (
  <button onClick={onClick || {}} className={names('button', className)} {...otherProps}>
    {text || ""}
  </button>
);

export default Button;