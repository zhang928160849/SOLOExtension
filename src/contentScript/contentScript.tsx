// import "./App.css";
import {
  Button,
  Popover,
  Label,
  Text,
  ThemeProvider,
  ButtonDomRef,
} from "@ui5/webcomponents-react";
import { useEffect, useState, useRef } from "react";
import GXpopover from "./component/GXpopover";
function ContentScript() {
  const [popovers, setPopovers] = useState([
    {
      parentid: "",
      contentID: "sold_to_party",
      id: "POP1",
      opener: "someAA",
      copener: "some",
      isOpen: false,
      termID: "sold_to_party",
      firstPopup: true,
      messageHandling: false,
    },
  ]);

  const btnRef = useRef<ButtonDomRef>();

  useEffect(() => {
    console.log(popovers, "- Has changed");

    const handleCustomOpen = (e) => {
      console.log("received custome event to open", e["detail"]);
      switchPOP(
        "POP1",
        e["detail"].locateElementID,
        e["detail"].contentID,
        true,
        true,
        e["detail"].isMessageHandling
      );
    };

    const handleCustomClose = (e) => {
      console.log("received custome event to close", e["detail"]);
      switchPOP(
        "POP1",
        e["detail"].locateElementID,
        e["detail"].contentID,
        false,
        true,
        e["detail"].isMessageHandling
      );
    };

    if (btnRef.current) {
      btnRef.current.addEventListener("CustomOpen", handleCustomOpen);
      btnRef.current.addEventListener("CustomClose", handleCustomClose);
      return () => {
        btnRef.current.removeEventListener("CustomClose", handleCustomClose);
        btnRef.current.removeEventListener("CustomOpen", handleCustomOpen);
      };
    }
  });

  let switchPOP = (
    id,
    locateElementID?: string,
    contentID?: string,
    status?: boolean,
    firstPopup: boolean = false,
    isMessageHandling: boolean = false
  ) => {
    let newList = [];
    for (let _ of popovers) {
      if (_.id === id) {
        if (status !== undefined) {
          _.isOpen = status;
        } else {
          _.isOpen = !_.isOpen;
        }
        _.termID = contentID;
        _.opener = locateElementID;
        _.firstPopup = firstPopup;
        _.messageHandling = isMessageHandling;
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
        firstPopup: false,
        messageHandling: false,
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
    <ThemeProvider>
      {popovers.map((item) => (
        <GXpopover
          key={item.id}
          id={item.id}
          opener={item.opener}
          isOpen={item.isOpen}
          copener={item.copener}
          openChildPOP={openChildPOP}
          termID={item.termID}
          firstPopup={item.firstPopup}
          closeChildPOP={closeChildPOP}
          placementType="Right"
          messageHandling={item.messageHandling}
        ></GXpopover>
      ))}
      <Button
        id={"openPopoverBtn"}
        ref={btnRef}
        onMouseOver={() => {
          console.log("hi");
          switchPOP("POP1");
        }}
        style={{ visibility: "hidden" }}
        onClick={() => {
          console.log("hi");
          switchPOP("POP1");
        }}
        onMouseOut={() => {
          switchPOP("POP1");
        }}
      >
        Hello, CK3
      </Button>
    </ThemeProvider>
  );
}

export default ContentScript;
