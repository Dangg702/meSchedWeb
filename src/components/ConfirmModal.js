import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import * as actions from '../store/actions';

class ConfirmModal extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState
    }

    initialState = {};
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
