import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { addMessage } from '~/store/actions';
import CustomScrollbars from '~/components/CustomScrollbars';
import './ChatAI.scss';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
        };
    }

    handleSend = async () => {
        const { input } = this.state;
        const { addMessage } = this.props;

        if (input.trim()) {
            const userMessage = { text: input, sender: 'You' };
            this.setState({ input: '' });

            // Lưu tin nhắn người dùng vào Redux
            addMessage(userMessage);

            const messageData = { message: input };

            try {
                const { data } = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/api/chatai/message`,
                    messageData,
                );

                // Thêm tin nhắn trả về từ server vào Redux, thay thế các ký tự xuống dòng bằng <br />
                const formattedMessage = data.split('\n').map((str, index) => (
                    <span key={index}>
                        {str}
                        <br />
                    </span>
                ));

                addMessage({ text: formattedMessage, sender: 'Nhân viên tư vấn' });
            } catch (error) {
                console.error('Error while sending message:', error);
            }
        }
    };

    handleSendKeyDown(event) {
        if (event.key === 'Enter') {
            this.handleSend();
        }
    }

    handleInputChange = (e) => {
        this.setState({ input: e.target.value });
    };

    render() {
        const { messages } = this.props;
        const { input } = this.state;

        return (
            <div className="chatContainer">
                <CustomScrollbars>
                    <div className="chatMessages">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`chatMessage ${
                                    message.sender === 'You' ? 'chatMessageYou' : 'chatMessageOther'
                                }`}
                            >
                                <strong>{message.sender}: </strong>
                                {message.text}
                            </div>
                        ))}
                    </div>
                </CustomScrollbars>
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={input}
                        onChange={this.handleInputChange}
                        placeholder="Type your message..."
                        className="input-chat"
                        onKeyDown={(e) => this.handleSendKeyDown(e)}
                    />
                    <button
                        onClick={this.handleSend}
                        className="button-send"
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
                    >
                        Send
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        messages: state.chat.messages,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addMessage: (message) => dispatch(addMessage(message)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
