import React from 'react';
import styles from './Element.module.css';
import Modal from './Modal.js';
import ColorPicker from './ColorPicker.js';

export default class Element extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showDialog: false,
      showEdit: false,
      tempWidth: null,
      tempLabel: props.element.label,
      tempBorder: props.element.border,
      tempColor: props.element.color,
      tempMargin: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.element !== this.props.element) {
      this.init(this.props);
    }
  }

  init(props) {
    this.setState({
      showDialog: false,
      showEdit: false,
      tempWidth: null,
      tempLabel: props.element.label,
      tempBorder: props.element.border,
      tempColor: props.element.color,
    });
  }

  render() {
    const {height, element} = this.props;
    const {width, color, border, label, margin} = element;
    const {
      showDialog,
      tempLabel,
      tempWidth,
      tempColor,
      tempBorder,
      showEdit,
      tempMargin,
    } = this.state;
    return (
      <div
        onMouseEnter={this.showDialog}
        onMouseLeave={this.hideDialog}
        style={{
          height: height,
          marginLeft: tempMargin || margin,
          width: tempWidth || width,
          background: color,
          borderColor: border || 'transparent',
        }}
        className={styles.item}>
        <div title="Spacing" style={{left: 0}} onMouseDown={this.startMove} className={styles.resize} />
        {label}
        <div title="Resize" onMouseDown={this.startResize} className={styles.resize} />
        {showDialog && (
          <div style={{left: 10}} className={styles.dialog}>
            <button onClick={this.startEdit} className={styles.button}>
              ✎
            </button>
            <button
              onClick={this.props.removeElement}
              className={styles.button}>
              x
            </button>
          </div>
        )}
        {showEdit && (
          <Modal>
            <div className={styles.modalContent}>
              <div className={styles.inputBlock}>
                <span>Label: </span>
                <input
                  className={styles.input}
                  onChange={this.changeLabel}
                  type="text"
                  value={tempLabel}
                  ref={el => (this.el = el)}
                />
              </div>
              <div className={styles.inputBlock}>
                <span>Margin: </span>
                <input
                  className={styles.input}
                  onChange={this.changeMargin}
                  type="number"
                  value={tempMargin}
                />
              </div>
              <div className={styles.inputBlock}>
                <ColorPicker
                  color={tempColor}
                  label="Color"
                  updateColor={this.changeColor.bind(this, 'tempColor')}
                />
              </div>
              <div className={styles.inputBlock}>
                <ColorPicker
                  color={tempBorder}
                  label="Border color"
                  updateColor={this.changeColor.bind(this, 'tempBorder')}
                />
              </div>
              <div className={styles.action}>
                <button onClick={this.cancelEdit} className={styles.save}>
                  Cancel
                </button>
                <button
                  onClick={this.saveEdit}
                  className={`${styles.save} ${styles.primary}`}>
                  Save
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
  startMove = e => {
    this.initialX = e.clientX;
    document.addEventListener('mousemove', this.move);
    document.addEventListener('mouseup', this.stopMove);
  }
  stopMove = () => {
    document.removeEventListener('mousemove', this.move);
    document.removeEventListener('mouseup', this.stopMove);
    const element = this.props.element;

    if (this.state.tempMargin) {
      element.margin = this.state.tempMargin;
      this.props.updateElement(element);
      this.setState({tempMargin: null});
    }
  };
  move = e => {
    const margin = (this.props.element.margin || 0) - (this.initialX - e.clientX);
    this.setState({
      tempMargin: margin > 0 ? margin : 0,
    });
  };
  startResize = e => {
    this.initialX = e.clientX;
    document.addEventListener('mousemove', this.resize);
    document.addEventListener('mouseup', this.stopResize);
  };
  stopResize = () => {
    document.removeEventListener('mousemove', this.resize);
    document.removeEventListener('mouseup', this.stopResize);
    const element = this.props.element;

    if (this.state.tempWidth) {
      element.width = this.state.tempWidth;
      this.props.updateElement(element);
      this.setState({tempWidth: null});
    }
  };
  resize = e => {
    const width = this.props.element.width - (this.initialX - e.clientX);
    this.setState({
      tempWidth: width > 80 ? width : 80,
    });
  };
  showDialog = () => this.setState({showDialog: true});
  hideDialog = () => this.setState({showDialog: false});
  startEdit = () => this.setState({showEdit: true}, () => this.el.focus());
  saveEdit = () => {
    const element = this.props.element;
    element.color = this.state.tempColor;
    element.border = this.state.tempBorder;
    element.label = this.state.tempLabel;
    element.margin = this.state.tempMargin;
    this.props.updateElement(element);
    this.setState({showEdit: false});
  };
  cancelEdit = () => {
    this.setState({
      tempColor: this.props.element.color,
      tempBorder: this.props.element.border,
      tempLabel: this.props.element.label,
      tempMargin: (this.props.element.margin || 0) * 1,
    });
    this.setState({showEdit: false});
  };
  changeColor = (state, color) => this.setState({[state]: color});
  changeLabel = e => this.setState({tempLabel: e.target.value});
  changeMargin = e => this.setState({tempMargin: e.target.value});
}
