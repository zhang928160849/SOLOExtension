//@ts-nocheck

import "react-chat-elements/dist/main.css";
import { MessageList } from "react-chat-elements";
import { Input, Button } from "react-chat-elements";
import { useState } from "react";
import { Buffer } from "buffer";

function Popup() {
  const [messages, setMessages] = useState([
    {
      position: "left",
      type: "text",
      title: "Misha",
      text: "I'm Misha, the solution order expert!",
    },
    {
      position: "right",
      type: "text",
      title: "You",
      text: "really? let me test you",
    },
  ]);

  const [inputText, setInputText] = useState("");

  const handleChange = (e) => {
    setInputText(e.target.value); // update input text state
  };

  const handleKeyPress = (e) => {
    console.log(e);
    if (e.key === "Enter") {
      const newMessages = [
        ...messages,
        {
          position: "right",
          type: "text",
          title: "You",
          text: inputText,
        },
        {
          position: "left",
          type: "text",
          title: "Misha",
          text: ".......",
        },
      ];

      console.log(newMessages);
      setMessages(newMessages);
      setInputText("");

      const encodedCredentials = Buffer.from(
        `guess:steveIsSoHandsome`,
        "utf-8"
      ).toString("base64");
      const headers = new Headers();
      headers.append("Authorization", "Basic " + encodedCredentials);

      fetch(
        `https://gpt-i500001.cfapps.eu10-004.hana.ondemand.com/gptF?q='` +
          inputText +
          `'`,
        {
          method: "GET",
          headers: headers,
        }
      )
        .then((response) => response.json())
        .then((gptData) => {
          setMessages((prevItems) => {
            if (gptData.content) {
              return [
                ...prevItems.slice(0, prevItems.length - 1),
                {
                  position: "left",
                  type: "text",
                  title: "Misha",
                  text: gptData.content,
                },
              ];
            } else {
              return [
                ...prevItems.slice(0, prevItems.length - 1),
                {
                  position: "left",
                  type: "text",
                  title: "Misha",
                  text: gptData[0].message.content,
                },
              ];
            }
          });
        });
    }
  };

  return (
    <div className="App">
      <MessageList
        className="message-list"
        lockable={false}
        toBottomHeight={"100%"}
        dataSource={messages}
      />

      <Input
        placeholder="Type here..."
        value={inputText}
        onSubmit={(e) => {
          console.log(e);
        }}
        onKeyPress={handleKeyPress}
        onChange={handleChange}
      />
    </div>
  );
}

export default Popup;
