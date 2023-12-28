
const Chat = ({ setOpenedChatTab }) => {
    return (
        <div className="position-fixed top-0  h-100 text-white bg-dark" style={{ width: "400px", left: "0%" }}>
            <button type="button" onClick={() => { setOpenedChatTab(false) }} className="btn btn-light btn-block w-100 mt-5">
                Close
            </button>
            <div className="w-100 mt-4 p-2 border  border-1 border-white rounded-3" style={{ height: "70%" }}>
                Chats
            </div>
            <form className="w-100 mt-4 d-flex  rounded-3">
                <input type="text" placeholder="Enter message" className="h-100 border-0 rouned-0 py-2 px-4" style={{ width: "90%" }} />
                <button type="submit" className="btn btn-primary rounded-0">Send</button>
            </form>
        </div>
    )
}

export default Chat