import Plot from 'react-plotly.js';
import { useState, useEffect } from 'react';

function InterferencePattern() {
    const [data, setData] = useState({});
    const [wavelengthNm, setWavelengthNm] = useState(633);
    const [refractiveIndex, setRefractiveIndex] = useState(1.0003);
    const [gapDist, setGapDist] = useState(1e-5);
    const [displayDist, setDisplayDist] = useState(0.5);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const k = 2 * Math.PI * refractiveIndex / (wavelengthNm * 1e-9);
        const size = 120;
        const start = 0.01;
        const step = (start * 2) / size;
        const x = Array.from({ length: size }, (_, i) => -start + i * step);
        const y = x.map(xx => displayDist * Math.tan(k * gapDist * xx / displayDist));

        const I = [];
        for (let i = 0; i < size; i++) {
            const yy = y[i];
            const bb = k * gapDist * Math.sin(Math.atan(yy / displayDist)) / 2;
            I.push((1 + Math.cos(k * gapDist * Math.cos(Math.atan(yy / displayDist)))) * Math.pow(Math.cos(bb), 2));
        }

        setData({ x, y, I });
    }, [wavelengthNm, refractiveIndex, gapDist, displayDist]);

    useEffect(() => {
        if (wavelengthNm <= 0 || gapDist <= 0 || displayDist <= 0 || refractiveIndex < 1) {
            setErrorMessage('Введенные значения некорректны');
        } else {
            setErrorMessage('Введенные значения корректны');
        }
    }, [wavelengthNm, refractiveIndex, gapDist, displayDist]);

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '800px'}}>
            <div style={{
                position: 'absolute',
                top: '50px',
                right: '50px',
                backgroundColor: errorMessage === 'Введенные значения некорректны' ? 'red' : 'green',
                padding: '5px 10px',
                color: 'white',
                borderRadius: '5px'
            }}>
                {errorMessage}
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <label style={{marginRight: '10px'}}>Длина волны (нм) </label>
                    <input type="number" value={wavelengthNm}
                           onChange={(e) => setWavelengthNm(e.target.value)}/>
                </div>
                <div style={{display: 'flex', alignItems: 'center', marginTop: '10px'}}>
                    <label style={{marginRight: '10px'}}>Показатель преломления</label>
                    <input type="number" value={refractiveIndex}
                           onChange={(e) => setRefractiveIndex(e.target.value)}/>
                </div>
                <div style={{display: 'flex', alignItems: 'center', marginTop: '10px'}}>
                    <label style={{marginRight: '10px'}}>Расстояние между щелями (м)</label>
                    <input type="number" value={gapDist}
                           onChange={(e) => setGapDist(e.target.value)}/>
                </div>
                <div style={{display: 'flex', alignItems: 'center', marginTop: '10px'}}>
                    <label style={{marginRight: '10px'}}>Расстояния до экрана(м)</label>
                    <input type="number" value={displayDist}
                           onChange={(e) => setDisplayDist(e.target.value)}/>
                </div>
            </div>
            <Plot
                data={[
                    {
                        x: data.x,
                        y: data.y,
                        type: 'heatmap',
                        z: [data.I],
                        colorscale: 'gray',
                    },
                ]}
                layout={{
                    width: 800,
                    height: 600,
                    title: 'Интерференционные полосы',
                    xaxis: {title: 'OX (м)'},
                    yaxis: {title: 'OY (м)'},
                }}
            />
        </div>
    );
}

export default InterferencePattern;
