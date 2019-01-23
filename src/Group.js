import React, {Component} from 'react';
import styles from './Group.module.css';
import elementStyles from './Element.module.css';
import Modal from './Modal.js';

export default class Group extends Component {
  state = {
    showDialog: false,
    showEdit: false,
    tempLabel: this.props.group.label,
    trackCount: this.props.group.rows.length,
  };
  render() {
    const {group} = this.props;
    const {showDialog, showEdit, tempLabel, trackCount} = this.state;

    return (
      <div
        onMouseEnter={this.showDialog}
        onMouseLeave={this.hideDialog}
        className={styles.hrLabel}>
        {group.label}
        {showDialog && (
          <div style={{left: 34}} className={elementStyles.dialog}>
            <button onClick={this.startEdit} className={elementStyles.button}>
              ✎
            </button>
            <button
              onClick={this.props.removeGroup}
              className={elementStyles.button}>
              x
            </button>
          </div>
        )}
        {showEdit && (
          <Modal>
            <div className={elementStyles.modalContent}>
              <div className={elementStyles.inputBlock}>
                <span>Label: </span>
                <input
                  className={elementStyles.input}
                  onChange={this.changeLabel}
                  type="text"
                  value={tempLabel}
                  ref={el => (this.el = el)}
                />
              </div>
              <div className={elementStyles.inputBlock}>
                <span>Tracks: </span>
                <input
                  className={elementStyles.input}
                  onChange={this.changeTracks}
                  type="number"
                  value={trackCount}
                />
              </div>
              <div className={elementStyles.action}>
                <button
                  onClick={this.cancelEdit}
                  className={elementStyles.save}>
                  Cancel
                </button>
                <button
                  onClick={this.saveEdit}
                  className={`${elementStyles.save} ${elementStyles.primary}`}>
                  Save
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
  showDialog = () => this.setState({showDialog: true});
  hideDialog = () => this.setState({showDialog: false});
  startEdit = () => this.setState({showEdit: true}, () => this.el.focus());
  saveEdit = () => {
    const group = this.props.group;
    const trackCount = this.state.trackCount;
    group.label = this.state.tempLabel;
    if (group.rows.length > trackCount) {
      group.rows.length = trackCount;
    } else {
      group.rows = [
        ...group.rows,
        ...Array.apply(null, {length: trackCount - group.rows.length}).map(() => ({
          elements: [],
        })),
      ];
    }
    this.props.updateGroup(group);
    this.setState({showEdit: false});
  };
  cancelEdit = () => {
    this.setState({
      tempLabel: this.props.group.label,
      trackCount: this.props.group.rows.length,
    });
    this.setState({showEdit: false});
  };
  changeLabel = e => this.setState({tempLabel: e.target.value});
  changeTracks = e => this.setState({trackCount: e.target.value});
}
