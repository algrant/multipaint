import React, { useRef, useEffect, useState } from 'react'
import MultiPaint from './MultiPaint';

// A simple react component that watches an imdata
// inspired by https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
const DataCanvas = props => {
  const canvasRef = useRef(null)
  const { width, height, imdata, update} = props;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const imageData = new ImageData(imdata, width, height);
    context.putImageData(imageData, 0, 0);
  }, [update, imdata, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} {...props}/>
}


const App = () => {
  const width = 512;
  const height = 512;

  // easier to watch update change rather than try to calculate if imdata changed...
  const [update, setUpdate] = useState(0);

  const [multiPaint] = useState(() => {
    return new MultiPaint(width, height)
  });

  const onMouseOver = (event) => {
    const x = event.nativeEvent.layerX;
    const y = event.nativeEvent.layerY;
    multiPaint.setSquareColour(x, y, 5, [0, 0, 0]);

    setUpdate(update + 1);
  };

  return (
    <div className="App">
      <DataCanvas 
        imdata = { multiPaint.imData }
        onMouseMove={onMouseOver}
        update = { update }
        width={ width } 
        height={ height }
      /> 
    </div>
  );
}

export default App;
