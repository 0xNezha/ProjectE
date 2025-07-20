import React from "react";
import { TitleBar, Cursor } from "@react95/core";
import { Textchat } from "@react95/icons";
import * as S from "./layoutStyling";

function About({ closeAboutModal }) {
  return (
    <S.styledModal
      icon={<Textchat variant="16x16_4" />}
      title={"关于本系统"}
      titleBarOptions={[
        <TitleBar.Close onClick={closeAboutModal} key="close" />,
      ]}
    >
      <S.styledModalFrame bg="white" boxShadow="$in">
      <h1>🔷 Project E 🔶</h1>
                <p>
                <h3>勇敢的 E 卫兵啊，快去创造奇迹</h3>
                <h3>   (单击桌面图标开始操作)</h3>
                </p>

                <p>
                    本 计 划 的 目 的 是 寻 找 到 忠 诚 的  E  卫 兵👮 . . . . . .
                    <br/>
                    要 成 为 忠 诚 的 E 卫 兵 , 您 需 要 ：
                    <ul>
                        <li><b>💰️ETH 占个人BN账号资产的份额前五</b>:<br/>
                        这代表着您的资产大部分都是ETH，“忠诚！” 快把 BTC 换成 ETH 吧！</li>
                        <li><b>👮不同的 ETH 余额代表着不同的军衔</b>:<br/>
                        按照ETH 余额的多少，您将晋升为 E列兵、E中尉、E上尉、E少校、E中校、E上校、E大校、E少将、E中将、E上将、E元帅</li>
                        <li><b>💎投入激烈的加密战场，期待下一次新高</b>:<br/>
                        GM Frens! LFG! ALL IN ETH! TO DA MOON!</li>
                    </ul>
                </p>
      </S.styledModalFrame>
    </S.styledModal>
  );
}

export default About;
