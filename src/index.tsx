import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm'
      // 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm' => alternative to saving the file on the project
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    setLoading(true);
    if (!ref.current) {
      return;
    }
    try {
      const result = await ref.current.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin(), fetchPlugin(input)],
        define: {
          'process.env.NODE_ENV': '"production"',
          global: 'window'
        }
      });
      setCode(result.outputFiles[0].text);
      setInput('');
    } catch (err) {
      setCode(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onClickClear = () => {
    setInput('');
    setCode('');
  };

  return (
    <div>
      <textarea
        className='textarea'
        placeholder='Insert your code here!'
        rows={10}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <br />
      <div className='buttons'>
        <button
          className='button is-primary is-outlined is-primary is-rounded'
          disabled={!input}
          onClick={onClick}
        >
          Submit
        </button>
        <button
          className='button is-primary is-outlined is-danger is-rounded'
          disabled={!code && !input}
          onClick={onClickClear}
        >
          Clear
        </button>
      </div>
      {loading && (
        <progress className='progress is-small is-primary' max='100'>
          45%
        </progress>
      )}
      {code ? <pre>{code}</pre> : <pre>Your Transpiled code should appear here!</pre>}
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
