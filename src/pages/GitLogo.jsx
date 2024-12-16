import React from 'react';
import logo from '../img/logo.png';

const GitLogo = () => {
    return (
        <>
        <br/>
        <div style={{ display: "flex" }}>
            <div>
                <img src={logo}  alt="Logo"  style={{ width: "45px", height: "45px", marginLeft: "10px" }} />
            </div>
            <div style={{ fontWeight: 'bold', fontSize: "20px", alignContent: "end", marginLeft: "3px"}}>
                Personal Project
            </div>
        </div>
        </>
    );
};

export default GitLogo;
