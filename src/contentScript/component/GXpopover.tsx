import {
  List,
  Popover,
  Text,
  StandardListItem,
} from "@ui5/webcomponents-react";
import { useState, useEffect } from "react";
import GXpopoverLabel from "./GXpopoverLabel";
import GXpopoverHeader from "./GXpopoverHeader";
import { Buffer } from "buffer";

function GXpopover(props) {
  const [lock, setLock] = useState(false);
  const [timeoutID, setTimeoutID] = useState(undefined);
  const [gptData, setGPTData] = useState([]);
  const [text, setText] = useState(() => {
    return { id: "", tittle: "", content1: [] };
  });

  useEffect(() => {
    // some flag to see if it's frist popup with fixed sentences or second popup with GPT text
    if (props.firstPopup && !props.messageHandling) {
      console.log("I am the first popup");

      // calcuted the fixed text here by
      setText({
        id: props.termID,
        tittle: props.termID,
        content1: [
          {
            t: "here's the quick assist",
            type: "p",
          },
          {
            t: `how the default value of ${props.termID} is determined`,
            type: "l",
            navID: `how the default value of ${props.termID} is determined`,
          },
          {
            t: `what's the definition of ${props.termID}`,
            type: "l",
            navID: `what's the definition of ${props.termID}`,
          },
        ],
      });
    } else if (!props.firstPopup) {
      // if not first popup, then do gpt

      const encodedCredentials = Buffer.from(
        `guess:steveIsSoHandsome`,
        "utf-8"
      ).toString("base64");
      const headers = new Headers();
      headers.append("Authorization", "Basic " + encodedCredentials);

      fetch(
        "https://gpt-i500001.cfapps.eu10-004.hana.ondemand.com/gptM?q=" +
          props.termID +
          " in sap S4/HANA",
        {
          method: "GET",
          headers: headers,
        }
      )
        .then((response) => response.json())
        .then((gptData) => {
          console.log("gpt data is" + gptData.content);

          var convertedGptData = [
            {
              t: gptData.content,
              type: "p",
            },
          ];

          setGPTData(convertedGptData);

          let found = {
            id: props.termID,
            tittle: props.termID,
            content1: [],
          };

          found.content1 = convertedGptData;
          setText(found);
          // 解析数据
        })
        .catch(console.error);
    } else if (props.firstPopup && props.messageHandling) {
      setText({
        id: props.termID,
        tittle: props.termID,
        content1: [
          {
            t: "I'm for message handling",
            type: "p",
          },
          {
            t: `definition of "${props.termID}"`,
            type: "l",
            navID: `I have below error "${props.termID}" in SAP s4/hana Business Solution Order application, what's the root cause`,
          },
        ],
      });
    }
  }, [props.termID]);

  const holdPopover = () => {
    console.log("holdpopover");

    let timeoutID = setTimeout(() => {
      setLock(true);
      console.log("lock set");
    }, 2000);

    setTimeoutID(timeoutID);
  };

  const stopHold = () => {
    console.log("kill hold");
    setLock(false);
    clearTimeout(timeoutID);
  };

  return (
    <Popover
      className="footerPartNoPadding"
      // headerText="Popover Header"
      horizontalAlign="Center"
      header={
        <GXpopoverHeader
          isOpen={props.isOpen && !lock}
          tittle={text.tittle}
        ></GXpopoverHeader>
      }
      open={props.isOpen || lock}
      onAfterClose={() => {
        stopHold();
      }}
      onAfterOpen={holdPopover}
      opener={props.opener}
      placementType={props.placementType}
      verticalAlign="Center"
      style={{ height: "330px", width: "500px", zIndex: "999" }}
    >
      <List>
        <GXpopoverLabel
          id={props.id}
          // copener={props.copener}
          openChildPOP={props.openChildPOP}
          dictionaryText={text.content1} //text.content1
          firstPopup={props.firstPopup}
          destroyChildPOP={(id) => {
            props.closeChildPOP(id);
          }}
        ></GXpopoverLabel>
      </List>
    </Popover>
  );
}

export default GXpopover;
