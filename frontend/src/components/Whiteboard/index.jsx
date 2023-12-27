import { useEffect, useLayoutEffect, useState } from "react";
import "./index.css";
import rough from 'roughjs';
// import rough from "roughjs/bundled/rough.esm";

const roughGenerator = rough.generator();


const WhiteBoard = ({ canvasRef, ctxRef, elements, setElements, tool, color, user, socket }) => {

    const [img, setImg] = useState(null);

    useEffect(()=>{
        socket.on("whiteBoardDataResponse", (data)=>{
            setImg(data.imgURL);
        })
    }, [])

    if (!user?.presenter) {
        return (
            <div className="border border-dark border-3 overflow-hidden  w-100 whiteboard-box">
                <img src={img} alt="Real time whiteboard image shared by presenter" 
                // className="w-100 h-100" 
                style={{
                    height: window.innerHeight * 2,
                    width: "285%",
                }}
                />
            </div>
        )
    }

    const [isDrawing, setIsDrawing] = useState(false)


    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.height = window.innerHeight * 2;
        canvas.width = window.innerWidth * 2;
        const ctx = canvas.getContext("2d");

        ctx.strokeStyle = color;
        ctx.linewidth = 2;
        ctx.lineCap = "round";

        ctxRef.current = ctx;
    }, [])

    // useLayoutEffect(() => {
    //     const roughCanvas = rough.canvas(canvasRef.current);

    //     elements.forEach((element) => {
    //         roughCanvas.linearPath(element.type)
    //     });

    // }, [elements])


    useEffect(() => {
        ctxRef.current.strokeStyle = color;
    }, [color])

    useLayoutEffect(() => {
        if (canvasRef) {


            if (elements) {
                const roughCanvas = rough.canvas(canvasRef.current);

                if (elements.length > 0) {
                    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }

                elements.forEach((element) => {

                    if (element.type === "rect") {
                        roughCanvas.draw(
                            roughGenerator.rectangle(
                                element.offsetX,
                                element.offsetY,
                                element.width,
                                element.height,
                                {
                                    stroke: element.stroke,
                                    strokeWidth: 5,
                                    roughness: 0
                                }
                            )
                        );
                    }
                    else if (element.type === "pencil") {
                        roughCanvas.linearPath(element.type, {
                            stroke: element.stroke,
                            strokeWidth: 5,
                            roughness: 0
                        }
                        );
                    }

                    else if (element.type === "line") {
                        roughCanvas.draw(
                            roughGenerator.line(
                                element.offsetX,
                                element.offsetY,
                                element.width,
                                element.height,
                                {
                                    stroke: element.stroke,
                                    strokeWidth: 5,
                                    roughness: 0,
                                },

                            )
                        );
                    }
                });
            }

            // const  canvasImage = canvasRef.current.toDefault();
            // socket.emit("whiteboardData", canvasImage)

            const canvasImage = canvasRef.current.toDataURL();
            socket.emit("whiteboardData", canvasImage);

        }
    }, [elements]);



    const handleMouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;


        if (tool === "pencil") {
            setElements((prevElements) => [
                ...prevElements || [],
                {
                    type: "pencil",
                    offsetX,
                    offsetY,
                    path: [[offsetX, offsetY]],
                    stroke: color,
                },
            ]);

        }

        else if (tool === "line") {
            setElements((prevElements) => [
                ...prevElements || [],
                {
                    type: "line",
                    offsetX,
                    offsetY,
                    width: offsetX,
                    height: offsetY,
                    stroke: color,
                },
            ]);
        }

        else if (tool === "rect") {
            setElements((prevElements) => [
                ...prevElements || [],
                {
                    type: "rect",
                    offsetX,
                    offsetY,
                    width: 0,
                    height: 0,
                    stroke: color,
                },
            ]);
        }

        setIsDrawing(true);

    }

    const handleMouseMove = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;

        if (isDrawing) {


            if (tool === "pencil") {
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

            else if (tool === "line") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                width: offsetX,
                                height: offsetY,
                            };
                        } else {
                            return ele;
                        }
                    })
                )
            }

            else if (tool === "rect") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                width: offsetX - ele.offsetX,
                                height: offsetY - ele.offsetY,
                            };
                        } else {
                            return ele;
                        }
                    })
                )
            }

        }

    }

    const handleMouseUp = (e) => {
        setIsDrawing(false)
    }



    return (

        <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="border border-dark border-3 overflow-hidden  w-100 whiteboard-box ">
            <canvas
                ref={canvasRef}
            />
        </div>



    )
}

export default WhiteBoard