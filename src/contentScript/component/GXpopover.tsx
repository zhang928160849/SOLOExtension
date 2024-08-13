import {
  List,
  Popover,
  Text,
  StandardListItem,
  CustomListItem,
  FlexBox,
  Button,
  Panel,
  Bar,
  Title,
  TextArea,
  ButtonDesign,
  BusyIndicator,
  Input,
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
  const [errorSolution, setErrorSolution] = useState(() => {
    return [
      {
        tittle: "Template",
        text: "Template",
        status: ButtonDesign.Negative,
        buttonText: "Accept",
        loadingStatus: "Loaded",
      },
    ];
  });

  let onAcceptButtonClick = (index) => {
    const encodedCredentials = Buffer.from(
      `username:password`,
      "utf-8"
    ).toString("base64");
    const headers = new Headers();
    headers.append("Authorization", "Basic " + encodedCredentials);

    fetch("urltemplate/quickfixNLP?content=" + errorSolution[index].text, {
      method: "post",
      headers: headers,
    })
      .then((response) => response.json())
      .then((gptData) => {
        const newErrorSolution = [...errorSolution];
        newErrorSolution[index].status = ButtonDesign.Positive;
        newErrorSolution[index].buttonText = "Accepted";
        newErrorSolution[index].loadingStatus = "Loaded";
        console.log("new solution is", newErrorSolution);
        setErrorSolution(newErrorSolution);
      })
      .catch(console.error);

    const newErrorSolution = [...errorSolution];
    newErrorSolution[index].loadingStatus = "Loading";
    setErrorSolution(newErrorSolution);
  };

  var ComponentToRender = (
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
        messageHandling={props.messageHandling}
      ></GXpopoverLabel>
    </List>
  );

  if (props.firstPopup && !props.messageHandling) {
  } else if (!props.firstPopup && props.messageHandling) {
    ComponentToRender = (
      <>
        {errorSolution.map((item, index) => {
          let solutionArea;

          if (item.loadingStatus == "Loaded") {
            solutionArea = <Text>{item.text}</Text>;
          } else {
            solutionArea = (
              <>
                <BusyIndicator
                  active
                  delay={1000}
                  size="Large"
                  text="Processing"
                />{" "}
              </>
            );
          }

          return (
            <Panel
              accessibleRole="Form"
              headerLevel="H2"
              header={
                <Bar
                  design="Header"
                  startContent={<Text>{item.tittle}</Text>}
                  endContent={
                    <Button
                      design={item.status}
                      onClick={() => {
                        onAcceptButtonClick(index);
                      }}
                    >
                      {item.buttonText}
                    </Button>
                  }
                ></Bar>
              }
              onToggle={function _a() {}}
              collapsed={true}
            >
              <Title level="H3">{item.tittle}</Title>
              {solutionArea}
            </Panel>
          );
        })}
        <Bar
          design="Header"
          startContent={<Input placeholder="your custom solution"></Input>}
          endContent={<Button>Execute</Button>}
        ></Bar>
      </>
    );
  }

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
    } else if (!props.firstPopup && props.messageHandling) {
      const encodedCredentials = Buffer.from(
        `username:password`,
        "utf-8"
      ).toString("base64");
      const headers = new Headers();
      headers.append("Authorization", "Basic " + encodedCredentials);
      fetch("URLtemplate/quickfixNLP?content=" + "solution template", {
        method: "POST",
        headers: headers,
      })
        .then((response) => response.json())
        .then((gptData) => {
          const newErrorSolution = [
            {
              tittle: "solution template",
              text: "solution template",
              status: ButtonDesign.Negative,
              buttonText: "Accept",
              loadingStatus: "Loaded",
            },
          ];

          console.log("new solution is", newErrorSolution);
          setErrorSolution(newErrorSolution);
        })
        .catch(console.error);
    } else if (!props.firstPopup && !props.messageHandling) {
      // if not first popup, then do gpt

      const encodedCredentials = Buffer.from(
        `username:password`,
        "utf-8"
      ).toString("base64");
      const headers = new Headers();
      headers.append("Authorization", "Basic " + encodedCredentials);

      fetch("Url/gptM?q=" + props.termID + " in sap S4/HANA", {
        method: "GET",
        headers: headers,
      })
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
            t: "I'm for message handling, here we can explain this error, why you got this error? why ERP need the check behind it",
            type: "p",
          },
          {
            t: `Solution to: "${props.termID}"`,
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
        setErrorSolution([
          {
            tittle: "solution A",
            text: "Solution 1: Use frequently used data to fix the error. To update the field cost center of item 20 of solution order 100002650 to frequently used cost centerThe frequently used cost center number in the data provided in the field responsibleCostCenter is '17101902'",
            status: ButtonDesign.Negative,
            buttonText: "Accept",
            loadingStatus: "Loaded",
          },
          {
            tittle: "solution B",
            text: "dummy solution",
            status: ButtonDesign.Negative,
            buttonText: "Accept",
            loadingStatus: "Loaded",
          },
        ]);
      }}
      onAfterOpen={holdPopover}
      opener={props.opener}
      placementType={props.placementType}
      verticalAlign="Center"
      style={{ height: "330px", width: "500px", zIndex: "999" }}
    >
      {ComponentToRender}
    </Popover>
  );
}

export default GXpopover;
