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

const BLACK = [0,0,0];
const GREY = [128, 128, 128];

const App = () => {
  const width = 512;
  const height = 512;

  // easier to watch update change rather than try to calculate if imdata changed...
  const [update, setUpdate] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const [colour, setColour] = useState(BLACK);

  const [multiPaint] = useState(() => {
    return new MultiPaint(width, height)
  });

  const onMouseMove = (event) => {

    if (mouseDown) {
      const x = event.nativeEvent.layerX;
      const y = event.nativeEvent.layerY;
      multiPaint.setSquareColour(x, y, 5, colour);
  
      setUpdate(update + 1);
    }
  };

  const onMouseDown = (event) => {
    setColour(BLACK);
    setMouseDown(true);
  }

  const onRightMouseDown = (event) => {
    event.preventDefault();
    setMouseDown(true);
    setColour(GREY);
  }

  const onMouseUp = () => {
    setMouseDown(false);
  }

  const onMouseOut = () => {
    setMouseDown(false);
  }

  return (
    <div className="App">
      <DataCanvas 
        imdata = { multiPaint.imData }
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onContextMenu={onRightMouseDown}
        onMouseUp={onMouseUp}
        update = { update }
        width={ width } 
        height={ height }
      /> 
    </div>
  );
}

export default App;
