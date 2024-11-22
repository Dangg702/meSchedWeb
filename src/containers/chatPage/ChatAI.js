import React, { Component } from "react";
import { connect } from "react-redux";
import { createStore } from "redux";
import { Provider } from "react-redux";
import axios from 'axios';

// Redux: action and reducer
const initialState = {
    messages: [],
};

// Action type
const ADD_MESSAGE = "ADD_MESSAGE";

// Action Creator
const addMessage = (message) => ({
    type: ADD_MESSAGE,
    payload: message,
});

// Reducer
const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };
        default:
            return state;
    }
};

// Store
const store = createStore(chatReducer);

// Component Chat
class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: "", // Nội dung nhập từ người dùng
        };
    }

    // Gửi tin nhắn từ client
    handleSend = async () => {
        const { input } = this.state;
        const { addMessage } = this.props;
    
        if (input.trim()) {
            const userMessage = { text: input, sender: "You" };
            this.setState({ input: "" });
    
            // Lưu tin nhắn người dùng vào Redux
            addMessage(userMessage);
    
            // Chuyển đổi dữ liệu thành JSON để gửi
            const messageData = { message: input };
    
            try {
                // Gửi yêu cầu POST đến server
                const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chatai/message`, messageData);
                console.log("Data from server:", data);
    
                // Thêm tin nhắn trả về từ server vào Redux, thay thế các ký tự xuống dòng bằng <br />
                const formattedMessage = data.split("\n").map((str, index) => (
                    <span key={index}>{str}<br /></span>
                ));
    
                addMessage({ text: formattedMessage, sender: "Nhân viên tư vấn" });
            } catch (error) {
                console.error("Error while sending message:", error);
            }
        }
    };

    handleInputChange = (e) => {
        this.setState({ input: e.target.value });
    };

    render() {
        const { messages } = this.props;
        const { input } = this.state;

        // Inline styles for chat components
        const styles = {
            chatContainer: {
                width: "90vw", // Chiếm toàn bộ chiều rộng màn hình
                height: "100vh", // Chiếm toàn bộ chiều cao màn hình
                display: "flex",
                flexDirection: "column",
                margin: "0 auto", 
                paddingBottom: "50px",
            },
            chatMessages: {
                flex: 1,
                overflowY: "auto",
                padding: "10px",
                display: "flex",
                flexDirection: "column-reverse", // Hiển thị tin nhắn mới nhất ở dưới cùng
            },
            chatMessages: {
                flex: 1,
                overflowY: "auto",
                padding: "10px",
                display: "flex",
                flexDirection: "column", // Đổi thành column thay vì column-reverse
            }
            ,
            chatMessageYou: {
                backgroundColor: "#d1e7dd",
                alignSelf: "flex-end",
            },
            chatMessageOther: {
                backgroundColor: "#f8d7da",
                alignSelf: "flex-start",
            },
            chatInput: {
                display: "flex",
                padding: "10px",
                borderTop: "1px solid #ccc",
            },
            input: {
                flex: 1,
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "5px",
            },
            button: {
                padding: "8px 10px",
                marginLeft: "5px",
                border: "none",
                backgroundColor: "#007bff",
                color: "#fff",
                borderRadius: "5px",
                cursor: "pointer",
            },
            buttonHover: {
                backgroundColor: "#0056b3",
            },
        };

        return (
            <div style={styles.chatContainer}>
                {/* Xóa phần header chat */}
                <div style={styles.chatMessages}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.chatMessage,
                                ...(message.sender === "You"
                                    ? styles.chatMessageYou
                                    : styles.chatMessageOther),
                            }}
                        >
                            <strong>{message.sender}: </strong>
                            {message.text}
                        </div>
                    ))}
                </div>
                <div style={styles.chatInput}>
                    <input
                        type="text"
                        value={input}
                        onChange={this.handleInputChange}
                        placeholder="Type your message..."
                        style={styles.input}
                    />
                    <button
                        onClick={this.handleSend}
                        style={styles.button}
                        onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#0056b3")
                        }
                        onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#007bff")
                        }
                    >
                        Send
                    </button>
                </div>
            </div>
        );
    }
}

// mapStateToProps để lấy tin nhắn từ Redux
const mapStateToProps = (state) => {
    return {
        messages: state.messages,
    };
};

// mapDispatchToProps để gửi action vào Redux
const mapDispatchToProps = (dispatch) => {
    return {
        addMessage: (message) => dispatch(addMessage(message)),
    };
};

// Kết nối Redux vào component
const ConnectedChat = connect(mapStateToProps, mapDispatchToProps)(Chat);

// Bao bọc ứng dụng với Provider và store
const App = () => (
    <Provider store={store}>
        <ConnectedChat />
    </Provider>
);

export default App;
