import React from 'react'
import About from './About'
import Programs from './Programs'
import Wallet from './Wallet'
import Binance from './Binance'
import Docs from './Documents'
import Contact from './Contact'
import Handbook from './Handbook'


function ContentFactory({ id, isMobile }) {

    switch (id) {
        case 'about':
            return <About />
        case 'contact':
            return <Contact />
        case 'programs':
            return <Programs />
        case 'wallet':
            return <Wallet />
        case 'binance':
            return <Binance />
        case 'docs':
            return <Docs />
        case 'handbook':
            return <Handbook />
        default:
            return (<div></div>);
    }
}

export default ContentFactory