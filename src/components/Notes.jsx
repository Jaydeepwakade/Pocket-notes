import React from "react";
import NoteBody from "./NoteBody";
import Home from "./Home";

const Notes = ({
  selectedNote,
  isPhone,
  display,
  setDisplay,
  noteActive
}) => {
  console.log("This")
  return (
    <>
      {selectedNote && selectedNote.notes ? (
        <NoteBody
          id={selectedNote._id}
          name={selectedNote.name}
          color={selectedNote.color}
          notes={selectedNote.notes}
          isPhone={isPhone}
          display={display}
          setDisplay={setDisplay}
        />
      ) : (
        <Home noteActive={noteActive}  isPhone={isPhone} />
      )}
    </>
  );
};

export default Notes;
