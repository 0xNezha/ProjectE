import React from "react";
import { TitleBar, Cursor } from "@react95/core";
import { HelpBook } from "@react95/icons";
import * as S from "./layoutStyling";

function Portfolio({ closePortfolio }) {
  return (
    <S.styledModal
      title="系统说明"
      titleBarOptions={[
        <S.styledModal.Minimize key="minimize" />,
        <TitleBar.Close onClick={closePortfolio} key="close" />,
      ]}
      height="100%"
      icon={<HelpBook variant="16x16_4" />}
    >
      <S.styledModalFrame bg="white" boxShadow="$in">
      <h1>EthGuards 95 操作指南</h1>
                <p>         
                    <ul>
                        <li><b>1、安装 Primus 浏览器扩展</b></li>
                        <li><b>2、在浏览器登陆 www.binance.com</b></li>
                        <li><b>3、单击“连接钱包”，登陆去中心化网络</b></li>
                        <li><b>4、单击 “E卫兵认证” 验证 BN 资产</b></li>
                        <li><b>5、在 Monad 网络上铸造E卫兵 NFT</b></li>
                    </ul>
                </p>
      </S.styledModalFrame>
    </S.styledModal>
  );
}

export default Portfolio;
