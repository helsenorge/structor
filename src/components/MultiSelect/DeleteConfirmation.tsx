import React from 'react';
import Modal from '../Modal/Modal';
import './DeleteConfirmation.css';

type Props = {
    isVisible: boolean;
    setIsDeleteConfirmationModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleOnMultipleDelete: () => void;
};

const DeleteConfirmation: React.FC<Props> = (props): JSX.Element | null => {
    const { isVisible, setIsDeleteConfirmationModalVisible, handleOnMultipleDelete } = props;

    if (!isVisible) {
        return null;
    }

    const onDelete = () => {
        handleOnMultipleDelete();
    };

    const onClose = () => {
        setIsDeleteConfirmationModalVisible(false);
    };

    return (
        <Modal title={'Delete Selected Nodes'}>
            <div className="delete-confirmation-modal">
                <div className="heading">Are you sure you want to delete all the selected nodes?</div>
                <p>
                    <li>
                        If you proceed, all the selected nodes and their children will be permanently deleted. This
                        action cannot be undone.
                    </li>
                </p>
                <div className="modal-btn-bottom">
                    <button type="button" className="primary regular-btn save-btn" onClick={() => onDelete()}>
                        Delete
                    </button>
                    <button
                        className="secondary regular-btn cancel-btn"
                        onClick={() => {
                            onClose();
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteConfirmation;
