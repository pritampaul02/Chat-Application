import React from 'react';

const InputBox = ({type, placeholder, style, title, labelShow, props}) => {
     return (
          <div>
               {labelShow && <label className={''}>{title}</label>}

               <input
                    type={type}
                    placeholder={placeholder}
                    className=""
                    style={style}
                    {...props}
               />
          </div>
     );
};

export default InputBox;
