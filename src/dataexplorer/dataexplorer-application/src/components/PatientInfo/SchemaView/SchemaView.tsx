import React from 'react';
import useFetch from 'utils/hooks/useFetch';

const SchemaView = (props: any) => {
    console.log('Schem Rendered');
    const { response } = useFetch('fhir/Patient/1');
    console.log(response);
    console.log(props);

    return (
        <>
            <div className="schema-container" style={{ paddingTop: 100 }}>
                {/* <div>
                    {searchResults.map((data) => (
                        <Card key={data.id} hoverable>
                            <h1>{data.name}</h1>
                            <p>Patient ID: {data.id} </p>
                        </Card>
                    ))}
                </div> */}
            </div>
        </>
    );
};

export default SchemaView;
