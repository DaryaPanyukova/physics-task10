import Plot from 'react-plotly.js';
import { useState, useEffect } from 'react';

function InterferencePattern() {
    const [data, setData] = useState({});
    const [wavelengthNm, setWavelengthNm] = useState(780);
    const [refractiveIndex, setRefractiveIndex] = useState(	1.000273);
    const [gapDist, setGapDist] = useState(0.3);
    const [displayDist, setDisplayDist] = useState(0.3);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const k = 2 * Math.PI * refractiveIndex / (wavelengthNm * 1e-9);
        const size = 200;
        const start = 1;
        const step = (start) / size;
        const x = Array.from({ length: size }, (_, i) => -start / 2 + i * step);

        const I = [];
        for (let i = 0; i < size; i++) {
            const tmp = Math.PI * refractiveIndex * gapDist * x[i] / (wavelengthNm * Math.pow(10, -9) * displayDist);
            const Ii = 4 * Math.pow(Math.cos(tmp), 2);
            I.push(Ii);
        }

        setData({ x, I });
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
                        colorscale: 'Greens',
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
