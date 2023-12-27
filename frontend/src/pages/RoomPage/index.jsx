import { useRef, useState } from "react"
import "./index.css"
import WhiteBoard from "../../components/Whiteboard";

const RoomPage = ({ user, socket, users }) => {

    const canvasRef = useRef(null)
    const ctxRef = useRef(null)


    const [tool, setTool] = useState("pencil");
    const [color, setColor] = useState("#000000");
    const [elements, setElements] = useState([]);
    const [openedUserTab, setOpenedUserTab] = useState(false)

    const [history, setHistory] = useState([]);


    const handleClearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillRect = "white";
        ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        );

        setElements([]);
    }

    const undo = () => {
        setHistory((prevHistory) => [...prevHistory || [], elements[elements.length - 1]]);
        setElements(
            (prevHistory) => prevHistory.slice(0, prevHistory.length - 1)
            // prevElements.filter((ele, index) => index !== elements.length - 1)
        )
    }

    const redo = () => {
        setElements((prevHistory) => [...prevHistory || [], history[history.length - 1]]);
        setHistory(
            (prevHistory) => prevHistory.slice(0, prevHistory.length - 1)
            // prevHistory.filter((ele, index) => index !== history.length - 1)
        )
    }



    return (
        <div className="row">

            <button type="button" onClick={()=>{setOpenedUserTab(true)}} className="btn btn-dark 5" style={{ display: "block", position: "absolute", top: "5%", left: "5%", height: "40px", width: "100px" }}>
                Users
            </button>
            {
                openedUserTab && (
                    <div className="position-fixed top-0  h-100 text-white bg-dark" style={{ width: "250px", left: "0%" }}>
                        <button type="button" onClick={()=>{setOpenedUserTab(false)}} className="btn btn-light btn-block w-100 mt-5">
                            Close
                        </button>
                        <div className="w-100 mt-5 pt-5">
                            {
                                users.map((usr, index) => (
                                    <p key={index * 999} className="my-2 w-100 text-center " >{usr.name} {user && user.userId === usr.userId && "- (You)"}</p>
                                ))
                            }
                        </div>
                    </div>
                )
            }

            <h1 className="text-center py-2">White Board Sharing App  <span className="text-primary">[Users Online : {users.length}]</span></h1>

            {
                user?.presenter && (

                    <div className="col-md-10 mx-auto px-5  mb-3 d-flex align-items-center justify-content-center">

                        <div className="d-flex col-md-2 justify-content-center gap-1">
                            <div className="d-flex gap-1 align-items-center ">
                                <label htmlFor="pencil">Pencil</label>
                                <input type="radio" id="pencil" name="tool" value="pencil" checked={tool === "pencil"} onChange={(e) => setTool(e.target.value)} />
                            </div>

                            <div className="d-flex gap-1 align-items-center ">
                                <label htmlFor="line">Line</label>
                                <input type="radio" id="line" name="tool" value="line" checked={tool === "line"} onChange={(e) => setTool(e.target.value)} />
                            </div>

                            <div className="d-flex gap-1 align-items-center ">
                                <label htmlFor="rect">Rectangle</label>
                                <input type="radio" id="rect" name="tool" value="rect" checked={tool === "rect"} onChange={(e) => setTool(e.target.value)} />
                            </div>
                        </div>

                        <div className="col-md-3 mx-auto">
                            <div className="d-flex  align-items-center justify-content-center">
                                <label htmlFor="color">Select Color:</label>
                                <input type="color" id="color" className="mt-1 ms-3" value={color} onChange={(e) => setColor(e.target.value)} />
                            </div>
                        </div>

                        <div className="col-md-3 d-flex  gap-2">

                            <button
                                className="btn btn-primary mt-1"
                                disabled={elements.length === 0}
                                onClick={() => undo()}
                            >Undo</button>

                            <button
                                className="btn btn-outline-primary mt-1"
                                disabled={history.length < 1}
                                onClick={() => redo()}
                            >Redo</button>

                        </div>

                        <div className="col-md-2">
                            <button className="btn btn-danger" onClick={handleClearCanvas}> Clear Canvas</button>
                        </div>

                    </div>

                )
            }



            <div className="col-md-10 mx-auto mt-2 canvas-box">
                <WhiteBoard
                    canvasRef={canvasRef}
                    ctxRef={ctxRef}
                    elements={elements}
                    setElements={setElements}
                    color={color}
                    tool={tool}
                    user={user}
                    socket={socket}

                />
            </div>

        </div>
    )
}

export default RoomPage 