import React from "react";

export default function Footer() {
    return (
        <div>
            <hr
                style={{
                    outline: "0px",
                    border: "0px",
                    backgroundColor: "#F3F3F3",
                    height: "2px",
                }}
            />
            <h5>Background image credit</h5>
            <button className="button">
                <a
                    href="https://www.wallpapertip.com/es/oiobJm/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    wallpapertip
                </a>
            </button>
        </div>
    );
}
