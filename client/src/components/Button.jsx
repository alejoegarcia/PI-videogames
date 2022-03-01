import React from "react";
import { Link } from "react-router-dom";

export default function Button(props) {
    if (props.click) {
        return (
            <button
                id={props.id}
                className="button"
                onClick={props.to}
                disabled={props.disabled}
            >
                {props.text}
            </button>
        );
    } else {
        return (
            <button id={props.id} className="button" disabled={props.disabled}>
                <Link to={props.to}>{props.text}</Link>
            </button>
        );
    }
}
