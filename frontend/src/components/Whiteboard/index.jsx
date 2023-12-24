import { useEffect, useLayoutEffect, useState } from "react";
import "./index.css";
import rough from 'roughjs';
// import rough from "roughjs/bundled/rough.esm";

const roughGenerator = rough.generator();


const WhiteBoard = ({ canvasRef, ctxRef, elements, setElements }) => {

    const [isDrawing, setIsDrawing] = useState(false)
    

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctxRef.current = ctx;
    }, [])

    // useLayoutEffect(() => {
    //     const roughCanvas = rough.canvas(canvasRef.current);

    //     elements.forEach((element) => {
    //         roughCanvas.linearPath(element.type)
    //     });

    // }, [elements])

    useLayoutEffect(() => {
        if (elements) {
            const roughCanvas = rough.canvas(canvasRef.current);
            elements.forEach((element) => {
                roughCanvas.linearPath(element.type);
            });
        }
    }, [elements]);


    const handleMouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;

        setElements((prevElements) => [
            ...prevElements,
            {
                type: "pencil",
                offsetX,
                offsetY,
                path: [[offsetX, offsetY]],
                stroke: "black",
            },
        ]);

        setIsDrawing(true);

    }

    const handleMouseMove = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;

        if (isDrawing) {

            // pencil by default as static
            const { path } = elements[elements.length - 1]
            const newPath = [...path, [offsetX, offsetY]]

            setElements((prevElements) =>
                prevElements.map((ele, index) => {
                    if (index === elements.length - 1) {
                        return {
                            ...ele,
                            path: newPath,
                        };
                    } else {
                        return ele;
                    }
                })
            )

        }

    }

    const handleMouseUp = (e) => {
        setIsDrawing(false)
    }


    return (


        <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="border border-dark border-3  w-100 whiteboard-box">

        </canvas>


    )
}

export default WhiteBoard