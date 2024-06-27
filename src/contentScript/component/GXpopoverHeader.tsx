import {
  Toolbar,
  Text,
  FlexBox,
  ToolbarSpacer,
} from "@ui5/webcomponents-react";

import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import AnimatedProgressProvider from "./AnimatedProgressProvider";
import { easeLinear } from "d3-ease";

function GXpopoverHeader(props) {
  //   return <Button slot={props.slot}>Close</Button>
  //   return <Bar endContent={<Button>xxx</Button>}></Bar>

  return (
    <Toolbar design="Auto" toolbarStyle="Standard">
      <Text>{props.tittle}</Text>
      <ToolbarSpacer />

      <ToolbarSpacer />
      <Example>
        {" "}
        <AnimatedProgressProvider
          visible={props.isOpen}
          valueStart={0}
          valueEnd={100}
          duration={2}
          easingFunction={easeLinear}
          repeat={false}
        >
          {(value) => {
            const roundedValue = Math.round(value);
            return (
              <CircularProgressbar
                value={value}
                // text={`${roundedValue}%`}
                /* This is important to include, because if you're fully managing the
animation yourself, you'll want to disable the CSS animation. */
                styles={buildStyles({ pathTransition: "none" })}
              />
            );
          }}
        </AnimatedProgressProvider>
      </Example>
    </Toolbar>
  );
}

function Example(props) {
  return (
    <div style={{ marginBottom: 0 }}>
      {/* <hr style={{ border: '2px solid #ddd' }} /> */}
      <div style={{ marginTop: 0, display: "flex" }}>
        <div style={{ width: "90%" }}></div>
        <div style={{ width: "10%", paddingRight: 10 }}>{props.children}</div>
      </div>
    </div>
  );
}

export default GXpopoverHeader;
