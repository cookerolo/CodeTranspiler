import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';

const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    const service = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm'
    });
    console.log(service);
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = () => {
    setCode(input);
    setInput('');
  };

  return (
    <div>
      <h1>Code Transpiler</h1>
      <textarea
        className='textarea'
        placeholder='Insert your code here!'
        rows={8}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      {code ? (
        <pre>{code}</pre>
      ) : (
        <pre>Your transpiled code should appear here once you submit it!</pre>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
