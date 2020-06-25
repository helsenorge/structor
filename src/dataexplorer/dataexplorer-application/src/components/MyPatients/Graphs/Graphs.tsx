import React from 'react';
import { Chart, Line, Point } from 'bizcharts';
import { Col } from 'antd';

const Graphs = () => {
    const data_g2 = [
        {
            year: '1991',
            value: 8.0,
        },
        {
            year: '1992',
            value: 5.0,
        },
        {
            year: '1993',
            value: 7.0,
        },
        {
            year: '1994',
            value: 3.0,
        },
        {
            year: '1995',
            value: 4.0,
        },
        {
            year: '1996',
            value: 1.0,
        },
        {
            year: '1997',
            value: 7.0,
        },
        {
            year: '1998',
            value: 2.0,
        },
        {
            year: '1999',
            value: 8.0,
        },
    ];
    const data_g1 = [
        {
            year: '1991',
            value: 3.0,
        },
        {
            year: '1992',
            value: 4.0,
        },
        {
            year: '1993',
            value: 3.5,
        },
        {
            year: '1994',
            value: 5.0,
        },
        {
            year: '1995',
            value: 4.9,
        },
        {
            year: '1996',
            value: 6.0,
        },
        {
            year: '1997',
            value: 7.0,
        },
        {
            year: '1998',
            value: 9.0,
        },
        {
            year: '1999',
            value: 13.0,
        },
    ];
    const data_graphs = [
        { name: 'Blodtrykk', data: data_g2 },
        { name: 'Livskvalitet', data: data_g1 },
    ];

    return (
        <>
            <Col span={14}>
                {data_graphs.map(({ name, data }) => (
                    <>
                        <h1> {name} </h1>
                        <Chart
                            padding={[10, 20, 50, 40]}
                            autoFit
                            height={500}
                            data={data}
                            scale={{ value: { min: 0 } }}
                        >
                            <Line position="year*value" />
                            <Point position="year*value" />
                        </Chart>
                    </>
                ))}
                ;<br></br>
            </Col>
        </>
    );
};

export default Graphs;
