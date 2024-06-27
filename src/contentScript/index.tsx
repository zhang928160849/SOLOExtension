import React from "react";
import { createRoot } from "react-dom/client";
import ContentScript from "./contentScript";
import "../../node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js";
// import App from "./App.jsx";

function init() {
  const container = document.createElement("div");
  if (!container) {
    console.log("create container fail");
  }

  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<ContentScript />);
  console.log(container);

  // let sold_to_party = document.querySelector(
  //   '[data-help-id="A_bt172h_solo:V_Details:T_label:C_btpartnerset:I_soldto_name"]'
  // );

  // sold_to_party.id = "someAA";

  document.addEventListener(
    "mouseover",
    function (e) {
      let elemID = (e.target as HTMLInputElement).getAttribute("id");
      let dataHelpID = (e.target as HTMLInputElement).getAttribute(
        "data-help-id"
      );

      let className = (e.target as HTMLInputElement).getAttribute("class");
      let parentElem = (e.target as HTMLInputElement).parentElement
        .parentElement;

      let parentElemID = parentElem.getAttribute("id");
      let parentElemHelpID = parentElem.getAttribute("data-help-id");

      if (className) {
        let obj = isValidMessageAndReturnIDAndContent(e.target);
        if (!obj) {
          return;
        }

        console.log("content is", obj.content);

        let hidebuttom = document.getElementById("openPopoverBtn");
        const event = new CustomEvent("CustomOpen", {
          detail: {
            locateElementID: obj.id,
            contentID: obj.content,
            isMessageHandling: true,
          },
        });
        hidebuttom.dispatchEvent(event);
      }

      if (dataHelpID) {
        let labelText = isValidLabelAndReturnTextElseNull(dataHelpID, e.target);

        if (!labelText) {
          return;
        }

        let hidebuttom = document.getElementById("openPopoverBtn");
        const event = new CustomEvent("CustomOpen", {
          detail: {
            locateElementID: elemID,
            contentID: labelText,
          },
        });
        hidebuttom.dispatchEvent(event);
      }

      // if (parentElemHelpID) {
      //   let contentID = isValidButtonAndReturnContentID(parentElemHelpID);
      //   if (!contentID) {
      //     return;
      //   }
      //   let hidebuttom = document.getElementById("openPopoverBtn");

      //   const event = new CustomEvent("CustomOpen", {
      //     detail: {
      //       locateElementID: parentElemID,
      //       contentID: contentID,
      //     },
      //   });
      //   hidebuttom.dispatchEvent(event);
      // }
    },
    false
  );

  document.addEventListener(
    "mouseout",
    function (e) {
      let elemID = (e.target as HTMLInputElement).getAttribute("id");
      let dataHelpID = (e.target as HTMLInputElement).getAttribute(
        "data-help-id"
      );
      let className = (e.target as HTMLInputElement).getAttribute("class");

      let parentElem = (e.target as HTMLInputElement).parentElement
        .parentElement;

      let parentElemID = parentElem.getAttribute("id");
      let parentElemHelpID = parentElem.getAttribute("data-help-id");

      let hidebuttom = document.getElementById("openPopoverBtn");

      // for messages
      if (className) {
        let obj = isValidMessageAndReturnIDAndContent(e.target);
        if (!obj) {
          return;
        }

        console.log("content is", obj.content);

        let hidebuttom = document.getElementById("openPopoverBtn");
        const event = new CustomEvent("CustomClose", {
          detail: {
            locateElementID: obj.id,
            contentID: obj.content,
            isMessageHandling: true,
          },
        });
        hidebuttom.dispatchEvent(event);
      }

      // for labels
      if (dataHelpID) {
        let labelText = isValidLabelAndReturnTextElseNull(dataHelpID, e.target);

        if (!labelText) {
          return;
        }

        console.log("how many times event has been triggered" + labelText);
        let hidebuttom = document.getElementById("openPopoverBtn");
        const event = new CustomEvent("CustomClose", {
          detail: {
            locateElementID: elemID,
            contentID: labelText,
          },
        });
        hidebuttom.dispatchEvent(event);
      }

      // if (parentElemHelpID) {
      //   let contentID = isValidButtonAndReturnContentID(parentElemHelpID);
      //   if (!contentID) {
      //     return;
      //   }
      //   let hidebuttom = document.getElementById("openPopoverBtn");

      //   const event = new CustomEvent("CustomClose", {
      //     detail: {
      //       locateElementID: parentElemID,
      //       contentID: contentID,
      //     },
      //   });
      //   hidebuttom.dispatchEvent(event);
      // }
    },
    false
  );

  // console.log(container);
  // setTimeout(() => {
  //   let e = document.getElementById("someA");
  //   const root = createRoot(e);
  //   root.render(<ContentScript />);
  //   console.log(container);
  // }, 1000);
}

function isValidItem(Item) {
  let allowedItems = ["SOS1", "SOT2", "SOS2", "SOT3"];

  let result = false;

  allowedItems.find((_) => {
    if (_ == Item) {
      result = true;
      return true;
    }
  });

  return result;
}

function isValidButtonAndReturnContentID(DataHelpID) {
  switch (DataHelpID) {
    case "A_bt172it_solo:V_SalesItem:T_button:I_simulate_sales_items":
      return "simulateSalesOrderCreation";
    case "A_crmcmp_prc:V_PrcItemCondeOVP:T_button:I_update_price":
      return "repriceInPriceDetails";
    case "A_crmcmp_prc:V_PrcItemCondeOVP:T_button:I_update_manual":
      return "completeRepriceInPriceDetails";
    case "A_bt172it_solo:V_ItemTreeView:T_button:I_release_items":
      return "releaseAllItems";
    case "A_bt172it_solo:V_ItemTreeView:T_button:I_define_item_relation":
      return "defineItemRelationship";
    default:
      break;
  }
  return null;
}

function isVaildBlockOrLabelAndReturnContentID(DataHelpID) {
  switch (DataHelpID) {
    case "A_bt172it_solo:V_TableSelectOVE:T_inputField:C_itemobjecttype:I_itemobjecttype":
      return "itemsTableViewSelection";
    case "A_bt172h_solo:V_Details:T_label:C_btpartnerset:I_soldto_name":
      return "sold_to_party";
    default:
      break;
  }
  return null;
}

function isValidMessageAndReturnIDAndContent(htmlElemnt) {
  if (
    htmlElemnt.hasAttribute("class") &&
    htmlElemnt.getAttribute("class") == "th-mes-line" &&
    htmlElemnt.hasAttribute("title") &&
    htmlElemnt.getAttribute("title") != "" &&
    htmlElemnt.getAttribute("title") != "Error"
  ) {
    if (htmlElemnt.parentElement.parentElement.hasAttribute("id")) {
      return {
        id: htmlElemnt.parentElement.parentElement.getAttribute("id"),
        content: htmlElemnt.getAttribute("title"),
      };
    } else {
      return null;
    }
  } else {
    return null;
  }
}

function isValidLabelAndReturnTextElseNull(DataHelpID, htmlElemnt) {
  if (
    DataHelpID.includes("A_bt172h_solo:V_Details:T_label:") ||
    DataHelpID.includes("A_bt112h_sc:V_Details:T_label:")
  ) {
    let titleText = htmlElemnt.getAttribute("title");
    return titleText;
  } else {
    return false;
  }
}

init();
