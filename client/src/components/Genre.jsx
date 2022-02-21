import React from 'react';

// style import
import s from "./Card.module.css";

export default function Genre(props) {
    return (
        <div className={s.genre}>
            <h6 className={s.secondaryText}>{props.name}</h6>
            <hr className={s.divider} />
        </div>
    );
}
