import React from "react";
import { Animate } from "react-move";

class AnimatedProgressProvider extends React.Component<
  {
    visible: boolean;
    valueStart: number;
    valueEnd: number;
    duration: number;
    easingFunction: any;
    repeat: boolean;
    children: any;
  },
  { isAnimated: boolean }
> {
  constructor(props: any) {
    super(props);
  }

  interval = undefined;

  state = {
    isAnimated: false,
  };

  static defaultProps = {
    valueStart: 0,
  };

  componentDidMount() {
    if (this.props.repeat) {
      this.interval = window.setInterval(() => {
        this.setState({
          isAnimated: !this.state.isAnimated,
        });
      }, this.props.duration * 1000);
    } else {
      this.setState({
        isAnimated: !this.state.isAnimated,
      });
    }
  }

  // componentDidUpdate() {
  //   this.setState({
  //     isAnimated: !this.state.isAnimated && this.props.allowStart
  //   })
  // }

  //   getDerivedStateFromProps

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    return (
      <Animate
        show={this.props.visible}
        start={() => ({
          value: this.props.valueStart,
        })}
        update={() => ({
          value: [
            this.state.isAnimated ? this.props.valueEnd : this.props.valueStart,
          ],
          timing: {
            duration: this.props.duration * 1000,
            ease: this.props.easingFunction,
          },
        })}
        leave={() => ({
          value: 0,
          timing: {
            duration: 0,
            ease: this.props.easingFunction,
          },
        })}
      >
        {({ value }) => this.props.children(value)}
      </Animate>
    );
  }
}

export default AnimatedProgressProvider;
