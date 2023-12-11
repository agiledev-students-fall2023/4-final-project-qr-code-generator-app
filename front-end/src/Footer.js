import React, { useEffect, useState } from 'react'
import './Footer.css'

const Footer = () => {
    const [isFixed, setIsFixed] = useState(false)

    useEffect(() => {
        const checkHeight = () => {
            const footerHeight = document.querySelector('.footer-container').offsetHeight
            const headerHeight = document.querySelector('.header-container') ? document.querySelector('.header-container').offsetHeight : 0
            const contentHeight = window.innerHeight - headerHeight - footerHeight

            if (document.body.scrollHeight > contentHeight) {
                setIsFixed(false)
            } else {
                setIsFixed(true)
            }
        }

        checkHeight()

        window.addEventListener('resize', checkHeight)

        return () => window.removeEventListener('resize', checkHeight)
    }, [])

    return (
        <div className={isFixed ? 'footer-container footer-fixed' : 'footer-container'}>
            <p className='footer-text'>© 2023 QRConnect. All Rights Reserved.</p>
            <div className='footer-links'>
                <a href='/ContactUs'>Contact Us</a>
                <span>|</span>
                <a href='https://github.com/agiledev-students-fall2023/4-final-project-qr-code-generator-app'>
                  Contribute
                </a>
            </div>
        </div>
    )
}

export default Footer
