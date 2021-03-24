import React from 'react';
import './LocalStorageMonitor.css';

const LocalStorageMonitor = (): JSX.Element => {
    const MAX_SPACE = 5 * 1024;
    const usedSpace = () => {
        let allData = '';
        Object.keys(localStorage).forEach((key) => {
            allData += localStorage.getItem(key);
        });
        const used = allData ? 3 + (allData.length * 16) / (8 * 1024) : 0;
        const percent = (used / MAX_SPACE) * 100;
        return Math.round(percent);
    };
    const getColor = (percent: number) => {
        const green = percent < 60 ? 255 : Math.floor(255 - ((percent * 2 - 100) * 255) / 100);
        const red = percent > 60 ? 255 : Math.floor((percent * 2 * 255) / 100);
        return `rgb(${red}, ${green}, 0)`;
    };
    const percentUsed = usedSpace();

    return (
        <div className="storage-bar" title={`Bruker ca ${percentUsed}% av nettleserens tilgjengelige lagringsplass`}>
            <div
                style={{
                    height: '100%',
                    width: `${percentUsed}%`,
                    backgroundColor: getColor(percentUsed),
                }}
            ></div>
        </div>
    );
};

export default LocalStorageMonitor;
