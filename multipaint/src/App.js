import React, { useRef, useEffect, useState } from 'react'
import MultiPaint from './MultiPaint';
import BrushTool, { genCircleBrush } from './BrushTool';
import "./App.css";

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
  // easier to flag updates rather than have react calculate when imdata changes...
  const [imdataUpdate, setImdataUpdate] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);

  const [leftBrush, setLeftBrush] = useState(genCircleBrush(10, "#FF0000"));

  const [multiPaint] = useState(() => {
    return new MultiPaint()
  });
  
  const paintAtEvent = (event) => {
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;

    multiPaint.paintPointBrushColour(x, y, leftBrush.brush, leftBrush.colourArray);
    setImdataUpdate(imdataUpdate + 1);
  }

  const onMouseMove = (event) => {
    if (mouseDown) {
      paintAtEvent(event);
    }
  };

  const onMouseDown = (event) => {
    paintAtEvent(event);
    setMouseDown(true);
  }

  const onMouseUp = () => {
    setMouseDown(false);
  }

  const onMouseOut = () => {
    setMouseDown(false);
  }

  return (
    <div className="App">
      <div className="FloatyView">
        <div className="ToolBar">
          <BrushTool 
            brush={leftBrush} 
            setBrush={ setLeftBrush }
          />
        </div>
        <div className="CanvasContainer">
          <DataCanvas 
            imdata = { multiPaint.imData }
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseOut={onMouseOut}
            update = { imdataUpdate }
            width={ multiPaint.width  } 
            height={ multiPaint.height }
          /> 
        </div>
      </div>
    </div>
  );
}

export default App;
