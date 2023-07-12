import React, { useRef, useEffect, useState } from "react";
import MultiPaint from "./MultiPaint";
import BrushTool, { genCircleBrush } from "./BrushTool";
import "./App.css";

// A simple react component that watches an imdata buffer & updates canvas on changes
// inspired by https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
const DataCanvas = (props) => {
  const canvasRef = useRef(null);
  const { width, height, imdata, update } = props;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const imageData = new ImageData(imdata, width, height);
    context.putImageData(imageData, 0, 0);
  }, [update, imdata, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} {...props} />;
};

const App = () => {
  // easier to flag updates rather than have react calculate when imdata changes...
  const [imdataUpdate, setImdataUpdate] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [leftBrush, setLeftBrush] = useState(genCircleBrush(10, "#FF0000"));

  const [multiPaint] = useState(() => {
    return MultiPaint.demoTiles();
  });

  const updateMousePos = (event) => {
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    setMousePos({ x, y });
    return { x, y };
  };

  const paintAtPosition = ({ x, y }) => {
    multiPaint.paintPointBrushColour(
      x,
      y,
      leftBrush.brush,
      leftBrush.colourArray,
    );
    setImdataUpdate(imdataUpdate + 1);
  };

  const paintLine = (p0, p1) => {
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    for (let i = 0; i < d - 1; i++) {
      multiPaint.paintPointBrushColour(
        p0.x + (dx * i) / d,
        p0.y + (dy * i) / d,
        leftBrush.brush,
        leftBrush.colourArray,
      );
    }
    multiPaint.paintPointBrushColour(
      p1.x,
      p1.y,
      leftBrush.brush,
      leftBrush.colourArray,
    );
    setImdataUpdate(imdataUpdate + 1);
  };

  const onMouseMove = (event) => {
    if (mouseDown) {
      const pos = updateMousePos(event);
      paintLine(mousePos, pos);
    }
  };

  const onMouseDown = (event) => {
    const pos = updateMousePos(event);
    paintAtPosition(pos);
    setMouseDown(true);
  };

  const onMouseUp = () => {
    setMouseDown(false);
  };

  const onMouseOut = () => {
    setMouseDown(false);
  };

  return (
    <div className="App">
      <div className="FloatyView">
        <div className="ToolBar">
          <BrushTool brush={leftBrush} setBrush={setLeftBrush} />
        </div>
        <div className="CanvasContainer">
          <DataCanvas
            width={multiPaint.width}
            height={multiPaint.height}
            imdata={multiPaint.imdata}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseOut={onMouseOut}
            update={imdataUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
