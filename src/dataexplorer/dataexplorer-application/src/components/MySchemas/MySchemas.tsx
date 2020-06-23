import React from 'react';
import SearchBox from 'components/SearchBox/SearchBox';

const MySchemas = (props: any) => {
    return (
        <div className="searchBoxContainer" style={{ paddingTop: 100 }}>
            <SearchBox placeholder="Finn et skjema" />
        </div>
    );
};

export default MySchemas;
