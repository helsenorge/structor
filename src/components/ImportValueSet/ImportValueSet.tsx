import React from 'react';
import Modal from '../Modal/Modal';

type Props = {
    close: () => void;
};

const ImportValueSet = ({ close }: Props): JSX.Element => {
    return (
        <Modal close={close} title="Importer Value Set">
            <p>hei</p>
        </Modal>
    );
};

export default ImportValueSet;
