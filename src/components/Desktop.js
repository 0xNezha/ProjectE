import React, { useState, useEffect } from 'react'
// import Explorer from './Explorer'
import Notepad from './Notepad';
// import DataContext from '../contexts/dataContext'
import '../App.css';
import { EventEmitter } from './EventEmitter';
import { Modal } from '@react95/core';
import { HelpBook, Printer, Explorer100, FlyingThroughSpace100, FolderExe2, FolderFile, InfoBubble, Mail3, Network2, QuestionBubble, Time, Timedate200, Url105 } from '@react95/icons';
import DesktopIcon from './DesktopIcon';

function WebsiteDesktop(props) {

    const isMobile = window.innerWidth < 850;
    const [openEditors, setOpenEditors] = useState([]);

    const [closeInfo, setCloseInfo] = useState(true);

    const editors = [
        { id: 'about', name: 'About', ico: <QuestionBubble />},
        { id: 'programs', name: 'Programs', ico: <FolderExe2 /> },
        { id: 'wallet', name: 'Wallet', ico: <FolderExe2 /> },
        { id: 'binance', name: 'Binance', ico: <FolderExe2 /> },
        { id: 'docs', name: 'Documents', ico: <FolderFile /> },
        { id: 'contact', name: 'Contact', ico: <Mail3 /> },
        { id: 'handbook', name: 'Handbook', ico: <Url105 /> },
    ];

    useEffect(() => {
        setOpenEditors([{id: 'about', name: 'About', ico: <QuestionBubble />}]);

        editors.forEach(editor => {
            EventEmitter.subscribe(editor.id, () => {
                openNotepad(editor)
            });
        });
        // eslint-disable-next-line
    }, []);

    const getNextX = (n) => {
        return `${35 + 5 * n}%`
    }

    const getNextY = (n) => {
        return `${15 + 5 * n}%`
    }

    const closeNotepad = (id) => {
        setOpenEditors(openEditors.filter(editor => editor.id !== id));

    };

    const openNotepad = (item) => {
        setOpenEditors(prevEditors => {
            if (!prevEditors.some(editor => editor.id === item.id)) {
                return [...prevEditors, item];
            }
            return prevEditors;
        });
    };

    return (
        <>
        <Modal
            icon={<FlyingThroughSpace100 />}
            title={`EthGuards.net`}
            style={{
                left: isMobile ? '5%' : '10%',
                top: isMobile ? '3%' : '5%',
                width: isMobile ? '90%' : 450,
            }}>
            <div className='centered'>
                <span className='title'>Project E</span>
                
                <div className='links'>
                    <a target='_blank' rel="noreferrer" href='https://github.com/0xNezha'>Github</a>
                    |
                    <a target='_blank' rel="noreferrer" href='https://discord.gg/'>Discord</a>
                    |
                    <a target='_blank' rel="noreferrer" href='https://www.substack.com'>Substack</a>
                </div>
            </div>
        </Modal>
        { closeInfo && (
            <Modal
                icon={<InfoBubble />}
                title={`info`}
                closeModal={() => setCloseInfo(false)}
                style={{
                    left: isMobile ? '50%' : '10%',
                    top: isMobile ? '30%' : '25%',
                    width: isMobile ? '90%' : 450,
                }}>
                <div className='centered'>
                <span>This website is best viewed on a laptop or PC.</span>
                </div>
            </Modal>
        )}
        {openEditors.map((editor, idx) => (
            <Notepad
                key={editor.id}
                closeNotepad={() => closeNotepad(editor.id)}
                ico={editor.ico}
                selectedItem={editor}
                isMobile={isMobile}
                left={getNextX(idx)}
                top={getNextY(idx)}
            />
        ))}
        <div className='init-icos'>
            <DesktopIcon ico={<FolderFile variant='32x32_4' />} text="Documents" eventType={'docs'}/>
            <DesktopIcon ico={<HelpBook />} text="帮助文档" eventType={'handbook'}/>
            <DesktopIcon ico={<Network2 />} text="连接钱包" eventType={'wallet'}/>
            <DesktopIcon ico={<Explorer100 />} text="启动BN验证" eventType={'binance'}/>
            <DesktopIcon ico={<Printer />} text="NFT 打印机" eventType={'programs'}/>
        </div>
        
    </>
    )
}

export default WebsiteDesktop