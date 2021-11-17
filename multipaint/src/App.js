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

const BLACK = [0, 0, 0];
const GREY = [128, 128, 128];

const App = () => {

  // easier to watch update change rather than try to calculate if imdata changed...
  const [update, setUpdate] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const [colour, setColour] = useState(BLACK);

  const [leftBrush, setLeftBrush] = useState(genCircleBrush(10, "#FF0000"));
  // const [rightBrush, setRightBrush] = useState({ colour: BLACK, brushType: CIRCLE });
  // const [brush, setBrush] = useState(undefined);

  const [multiPaint] = useState(() => {
    return new MultiPaint()
  });

  const onMouseMove = (event) => {

    if (mouseDown) {
      const x = event.nativeEvent.layerX;
      const y = event.nativeEvent.layerY;
      multiPaint.setBrushColour(x, y, leftBrush.brush, leftBrush.colourArray);
      setUpdate(update + 1);
    }
  };

  const onMouseDown = (event) => {
    const x = event.nativeEvent.layerX;
    const y = event.nativeEvent.layerY;
    multiPaint.setBrushColour(x, y, leftBrush.brush, leftBrush.colourArray);
    setUpdate(update + 1);
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
            onContextMenu={onRightMouseDown}
            onMouseUp={onMouseUp}
            onMouseOut={onMouseOut}
            update = { update }
            width={ multiPaint.width  } 
            height={ multiPaint.height }
          /> 
        </div>
      </div>
    </div>
  );
}

export default App;
