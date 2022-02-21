import React from "react";

export default function Button(props) {
    return (
        <button id={props.id} onClick={props.click}>
            {props.text}
        </button>
    );
}
