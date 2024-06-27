import "./App.css";
import { Button, Popover, Label, Text } from "@ui5/webcomponents-react";
import { useEffect, useState, useRef } from "react";
import GXpopover from "./component/GXpopover";
function App() {
  const [popovers, setPopovers] = useState([
    {
      parentid: "",
      contentID: "ck3",
      id: "POP1",
      opener: "openPopoverBtn",
      copener: "some",
      isOpen: false,
      termID: "ck3",
    },
  ]);

  useEffect(() => {
    console.log(popovers, "- Has changed");
  });

  let switchPOP = (id) => {
    let newList = [];
    for (let _ of popovers) {
      if (_.id === id) {
        _.isOpen = !_.isOpen;
      }
      newList.push(_);
    }
    setPopovers(newList);
  };

  let openChildPOP = (parentID, openerID, termID, ChildPOPID) => {
    let isNeedCreateNewPOP = true;

    let updatedPopovers = popovers.map((_) => {
      if (_.id == ChildPOPID) {
        isNeedCreateNewPOP = false;
        return { ..._, isOpen: true, termID, opener: openerID };
      }

      if (_.id == parentID) {
        return { ..._, copener: openerID };
      }

      return { ..._ };
    });

    if (isNeedCreateNewPOP) {
      let newPOP = {
        id: ChildPOPID,
        opener: openerID,
        copener: openerID + "N",
        isOpen: true,
        parentid: updatedPopovers[updatedPopovers.length - 1].id,
        termID: termID,
        contentID: "",
      };

      updatedPopovers.push(newPOP);
    }
    setPopovers(updatedPopovers);
  };

  let closeChildPOP = (childPOPID) => {
    console.log("close", popovers);
    let newList = popovers.map((_) => {
      if (_.id == childPOPID) {
        return { ..._, isOpen: false };
      }
      return { ..._ };
    });
    console.log("new list", newList);
    setPopovers(newList);
  };

  return (
    <div>
      {popovers.map((item) => (
        <GXpopover
          key={item.id}
          id={item.id}
          opener={item.opener}
          isOpen={item.isOpen}
          copener={item.copener}
          openChildPOP={openChildPOP}
          termID={item.termID}
          // setClose={() => {
          //   switchPOP(item.id)
          // }}
          closeChildPOP={closeChildPOP}
          placementType="Left"
        ></GXpopover>
      ))}
      <Button
        id={"openPopoverBtn"}
        style={{ visibility: "hidden" }}
        onMouseOver={() => {
          console.log("hi");
          switchPOP("POP1");
        }}
        onMouseOut={() => {
          switchPOP("POP1");
        }}
      ></Button>
    </div>
  );
}

export default App;
