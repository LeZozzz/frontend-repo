import React, { useState } from 'react';

const STAR_COUNT = 5;

const Star = ({
    filled,
    half,
    onClick,
    onMouseMove,
    onMouseLeave,
    animated
}) => (
    <span
        style={{
            cursor: 'pointer',
            color: filled || half ? '#ff007f' : '#aaa',
            transition: animated ? 'transform 0.2s' : undefined,
            transform: animated ? 'scale(1.2)' : undefined,
            fontSize: '2em',
            marginRight: 2,
            position: 'relative',
            display: 'inline-block',
            userSelect: 'none'
        }}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
    >
        {half ? (
            <span style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ position: 'absolute', width: '50%', overflow: 'hidden', color: '#ff007f' }}>★</span>
                <span style={{ color: '#aaa' }}>★</span>
            </span>
        ) : '★'}
    </span>
);

const Rating = ({ onRate }) => {
    const [hoverValue, setHoverValue] = useState(undefined);
    const [value, setValue] = useState(0);
    const [animatedIndex, setAnimatedIndex] = useState(null);

    const handleClick = (val, idx) => {
        setValue(val);
        setAnimatedIndex(idx);
        if (onRate) onRate(val);
        setTimeout(() => setAnimatedIndex(null), 200);
    };

    const handleMouseMove = (e, i) => {
        const { left, width } = e.target.getBoundingClientRect();
        const x = e.clientX - left;
        if (x < width / 2) {
            setHoverValue(i + 0.5);
        } else {
            setHoverValue(i + 1);
        }
    };

    const handleMouseLeave = () => setHoverValue(undefined);

    const displayValue = hoverValue !== undefined ? hoverValue : value;

    return (
        <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            {[...Array(STAR_COUNT)].map((_, i) => {
                let filled = displayValue >= i + 1;
                let half = !filled && displayValue >= i + 0.5;
                return (
                    <Star
                        key={i}
                        filled={filled}
                        half={half}
                        animated={animatedIndex === i}
                        onClick={() => handleClick(half ? i + 0.5 : i + 1, i)}
                        onMouseMove={e => handleMouseMove(e, i)}
                        onMouseLeave={handleMouseLeave}
                    />
                );
            })}
            <span style={{ marginLeft: 10, fontSize: '1em', color: '#ff007f' }}>
                {displayValue > 0 ? `${displayValue.toFixed(1)} / 5` : ''}
            </span>
        </div>
    );
};

export default Rating;