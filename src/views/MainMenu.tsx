import React from 'react';
import { Link } from 'react-router-dom';
import './MainMenu.css';

const MainMenu = (): JSX.Element => {
    return (
        <div className="main-menu align-everything">
            <div className="align-everything">
                <Link to="/new-create-form">
                    <button className="index-buttons">Nytt skjema</button>
                </Link>
                <button className="index-buttons">Last opp skjema</button>
            </div>
        </div>
    );
};

export default MainMenu;
