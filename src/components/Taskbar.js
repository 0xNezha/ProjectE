import { List, TaskBar } from "@react95/core";
import { Explore, FolderExe, FolderFile, Help, HelpBook, Mail2, Network3 } from "@react95/icons";
import { EventEmitter } from "./EventEmitter";
// import { useContext } from "react";

export default function WebsiteTaskbar(props) {

    const handleClick = (x) => {
        switch(x) {
          case 'terrabit':
            window.open('https://terrabit.idealabs.network');
            break;
          default:
            EventEmitter.dispatch(x, true);
            break;
        }
    }

    return (
        <TaskBar list={<List>
            <List.Item icon={<FolderExe/>}>
              <span onClick={() => handleClick('programs')}>Programs</span>
              <List>
                <List.Item icon={<Network3 />} onClick={() => handleClick('wallet')}>
                  <span>连接钱包</span>
                </List.Item>
                <List.Item icon={<Explore />} onClick={() => handleClick('binance')}>
                  启动BN验证
                </List.Item>
              </List>
            </List.Item>
            <List.Item icon={<FolderFile/>} onClick={() => handleClick('docs')}>
              <span>Documents</span>
              <List>
                <List.Item>
                  Project E 文档 
                </List.Item>
                <List.Item>
                  Project E 白皮书
                </List.Item>
                <List.Item>
                  Project E 路线图
                </List.Item>
              </List>
            </List.Item>
            <List.Item icon={<HelpBook />}>
              Help
              <List>
                <List.Item onClick={() => handleClick('handbook')}>
                  Project E 操作指南
                </List.Item>
              </List>
            </List.Item>
            <List.Divider />
            <List.Item icon={<Help/>} onClick={() => handleClick('about')}>
              <span>About</span>
            </List.Item>
            <List.Item icon={<Mail2/>} onClick={() => handleClick('contact')}>
              <span>Contact</span>
            </List.Item>
          </List>} />
    );
}