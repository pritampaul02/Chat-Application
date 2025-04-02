import React from 'react';
import InputBox from './components/ui/InputBox';

const App = () => {
     return (
          <div className="text-xl">
               <h1>Try</h1>
               <InputBox
                    type="password"
                    placeholder="Text"
                    className="bg-gray-500"
                    title="Text"
                    labelShow={true}
               />
          </div>
     );
};

export default App;
