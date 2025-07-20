import React from 'react';
import { Modal } from '@react95/core';
import ContentFactory from './NotepadContent/ContentFactory';

function Notepad({ ico, closeNotepad, selectedItem, isMobile, left, top, focused }) {
  return (
    <Modal
      icon={ico}
      title={`${selectedItem.name}`}
      closeModal={closeNotepad}
      buttons={[{ value: "Close", onClick: closeNotepad }]}
      style={{
        left: isMobile ? '5%' : left,
        top: isMobile ? '3%' : top,
        width: isMobile ? '90%' : 450,
        // Add focus styles based on the 'focused' prop
        border: focused ? '2px solid #008080' : 'none', // Change the color and style as needed
      }}
      menu={[
        { name: 'File', list: [] },
        { name: 'Edit', list: [] }
      ]}
    >
      <ContentFactory id={selectedItem.id} isMobile={isMobile} />
    </Modal>
  );
}

export default Notepad;
