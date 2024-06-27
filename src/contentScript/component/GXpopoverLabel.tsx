import { Label, Link, Text, StandardListItem } from "@ui5/webcomponents-react";
import GXpopover from "./GXpopover";
import { useState, useEffect } from "react";
import { Popover } from "@ui5/webcomponents-react";

function GXpopoverLabel(props) {
  // const [childPOPID, setChildPOPID] = useState()
  const [content, setContent] = useState(() => {
    // let ncontent =
    // return ncontent
  });

  var getRandomInt = function (max) {
    return Math.floor(Math.random() * max);
  };

  const [randomSeed] = useState(() => {
    return getRandomInt(10000);
  });

  return props.dictionaryText.map((_) => {
    switch (_.type) {
      case "p":
        if(!props.firstPopup){
          return <Text>{_.t}</Text>;
        }else{
          return (<StandardListItem>
            <Text>{_.t}</Text>
          </StandardListItem>);
        }
      case "l":
        return (
          <StandardListItem>
            <Link
              key={props.dictionaryID}
              id={randomSeed + _.navID}
              onMouseOver={() => {
                props.openChildPOP(
                  props.id,
                  randomSeed + _.navID,
                  _.navID,
                  randomSeed + "POPID"
                );
                // setChildPOPID(nchildPOP)
              }}
              onMouseOut={() => {
                props.destroyChildPOP(randomSeed + "POPID");
                // setPopoverIsOpen(false)
              }}
            >
              {_.t}
            </Link>
          </StandardListItem>
        );
      default:
        break;
    }
  });
}

export default GXpopoverLabel;
