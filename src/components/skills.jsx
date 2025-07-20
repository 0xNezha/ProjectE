import React from "react";
import { TitleBar, ProgressBar } from "@react95/core";
import { BatExec2 } from "@react95/icons";
import * as S from "./layoutStyling";

function Skills({ closeSkillsModal }) {
  return (
    <S.styledModal
      className="styledModal"
      title={"E卫兵认证"}
      titleBarOptions={[
        <S.styledModal.Minimize key="minimize" />,
        <TitleBar.Close onClick={closeSkillsModal} key="close" />,
      ]}
      height="100%"
      icon={<BatExec2 variant="16x16_4" />}
    >
      <S.styledModalFrame bg="white" boxShadow="$in">
        <h1>*****E卫兵验证*****</h1>
      </S.styledModalFrame>
    </S.styledModal>
  );
}

export default Skills;
