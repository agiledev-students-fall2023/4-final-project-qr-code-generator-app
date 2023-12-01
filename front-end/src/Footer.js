import React, { useEffect, useState } from "react";
import "./Footer.css";

const Footer = () => {
    const [isFixed, setIsFixed] = useState(false);

    useEffect(() => {
        const checkHeight = () => {
            const footerHeight = document.querySelector('.footer-container').offsetHeight;
            const headerHeight = document.querySelector('.header-container') ? document.querySelector('.header-container').offsetHeight : 0; // Replace with your header selector if you have one
            const contentHeight = window.innerHeight - headerHeight - footerHeight;

            if (document.body.scrollHeight > contentHeight) {
                setIsFixed(false);
            } else {
                setIsFixed(true);
            }
        };

        checkHeight();

        window.addEventListener('resize', checkHeight);

        return () => window.removeEventListener('resize', checkHeight);
    }, []);

    return (
        <div className={isFixed ? "footer-container footer-fixed" : "footer-container"}>
            <p className="footer-text">© 2023 My App. All Rights Reserved.</p>
            <div className="footer-links">
                <a href='/PrivacyPolicy'>Privacy Policy</a>
                <a href='/termOfServices'>Terms of Service</a>
                <a href="/ContactUs">Contact Us</a>
            </div>
        </div>
    );
};

export default Footer;
