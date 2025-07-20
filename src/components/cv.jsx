import React from "react";
import { TitleBar, Cursor } from "@react95/core";
import { Filexfer128 } from "@react95/icons";
import * as S from "./layoutStyling";

function CV({ closeCV }) {
  return (
    <S.styledModal
      icon={<Filexfer128 variant="16x16_4" />}
      title={"连接钱包"}
      titleBarOptions={[
        <S.styledModal.Minimize key="minimize" />,
        <TitleBar.Close onClick={closeCV} key="close" />,
      ]}
      height="100%"
    >
      <S.styledModalFrame bg="white" boxShadow="$in">
        <h1>在此处连接钱包</h1>
      </S.styledModalFrame>
    </S.styledModal>
  );
}

export default CV;
