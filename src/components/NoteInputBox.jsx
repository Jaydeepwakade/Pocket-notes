import React, { useState } from "react";
import "../styles/NoteInputBox.css";

const NoteInputBox = ({ id, handleNewNote }) => {
  console.log(id)
  const [note, setNote] = useState("");
  const [disableBtn, setDisableBtn] = useState(true);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setNote(value);
    setDisableBtn(value.trim() === ""); 
  };

  const handleSendClick = async () => {
    // console.log(id)
    if (!id) {
      console.error("Group ID is not defined.");
      return;
    }
    console.log(id)
    const newNotes = {
      content: note,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      id: id 
    };

    try {
      const response = await fetch(`https://pocketenotes-server.onrender.com/note-groups/${id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({newNotes}),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const addedNote = await response.json();
      handleNewNote(addedNote); // Update UI with the new note
      setNote("");
      setDisableBtn(true);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  return (
    <div className="inputContainer">
      <div className="inputBoxContainer flex flex-row">
        <textarea
          name="note"
          cols="30"
          rows="6"
          className="inputBox"
          placeholder="Enter your text here..........."
          onChange={handleInputChange}
          value={note}
        ></textarea>
        <button
          className="sendBtn"
          disabled={disableBtn}
          onClick={handleSendClick}
        >
          <svg
            width="25"
            height="29"
            viewBox="0 0 35 29"
            fill="#ABABAB"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 29V18.125L14.5 14.5L0 10.875V0L34.4375 14.5L0 29Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NoteInputBox;
