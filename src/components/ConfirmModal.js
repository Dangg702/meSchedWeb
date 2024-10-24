import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

// import './ConfirmModal.scss';
import * as actions from '../store/actions';
import { KeyCodeUtils } from '../utils';

class ConfirmModal extends Component {
    constructor(props) {
        super(props);
        this.acceptBtnRef = React.createRef();
    }

    initialState = {};

    state = {
        ...this.initialState,
    };

    // componentDidMount() {
    //     document.addEventListener('keydown', this.handlerKeyDown);
    // }

    // componentDidUpdate(prevProps) {
    //     const { contentOfConfirmModal } = this.props;
    //     if (prevProps.contentOfConfirmModal.isOpen !== contentOfConfirmModal.isOpen) {
    //         if (contentOfConfirmModal.isOpen) {
    //             this.acceptBtnRef.current.focus();
    //         }
    //     }
    // }
    // componentWillUnmount() {
    //     document.removeEventListener('keydown', this.handlerKeyDown);
    // }

    // handlerKeyDown = (event) => {
    //     const keyCode = event.which || event.keyCode;
    //     if (keyCode === KeyCodeUtils.ENTER) {
    //         if (!this.acceptBtnRef.current || this.acceptBtnRef.current.disabled) return;
    //         this.acceptBtnRef.current.click();
    //     }
    // };

    // onAcceptBtnClick = () => {
    //     const { contentOfConfirmModal } = this.props;
    //     if (contentOfConfirmModal.handleFunc) {
    //         contentOfConfirmModal.handleFunc(contentOfConfirmModal.dataFunc);
    //     }
    //     this.onClose();
    // };

    // onClose = () => {
    //     this.props.setContentOfConfirmModal({
    //         isOpen: false,
    //         messageId: '',
    //         handleFunc: null,
    //         dataFunc: null,
    //     });
    // };

    render() {
        const { isOpen, toggle, onDelete, itemName } = this.props;

        return (
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>Xác nhận xóa</ModalHeader>
                <ModalBody>
                    Sau khi xóa sẽ không thể hoàn tác. Bạn có chắc chắn muốn xóa {itemName} này không?
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={onDelete}>
                        Xóa
                    </Button>{' '}
                    <Button color="secondary" onClick={toggle}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.app.language,
        contentOfConfirmModal: state.app.contentOfConfirmModal,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setContentOfConfirmModal: (contentOfConfirmModal) =>
            dispatch(actions.setContentOfConfirmModal(contentOfConfirmModal)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModal);
