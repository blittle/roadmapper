import React from 'react';
import styles from './ColorPicker.module.css';
import {TwitterPicker} from 'react-color';

const COLORS = [
  "#001f3f",
  "#0074D9",
  "#7FDBFF",
  "#39CCCC",
  "#3D9970",
  "#2ECC40",
  "#01FF70",
  "#FFDC00",
  "#FF851B",
  "#FF4136",
  "#85144b",
  "#F012BE",
  "#B10DC9",
  "#111111",
  "#AAAAAA",
  "#DDDDDD",
  "#FFFFFF",
];

export default class ColorPicker extends React.Component {
  state = {
    hidePicker: true,
  };
  render() {
    const {color, label} = this.props;
    const {hidePicker} = this.state;
    return (
      <React.Fragment>
        <span>{label}: </span>
        <span
          onClick={this.showPicker}
          style={{background: color}}
          className={styles.color}
        />
        {!hidePicker && (
          <div className={styles.colorPicker}>
            <TwitterPicker colors={COLORS} onChangeComplete={this.hidePicker} color={color} />
          </div>
        )}
      </React.Fragment>
    );
  }
  showPicker = () => this.setState({hidePicker: false});
  hidePicker = color => {
    this.props.updateColor(color.hex);
    this.setState({hidePicker: true});
  };
}
