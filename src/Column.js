import React, {Component} from 'react';
import elementStyles from './Element.module.css';
import columnStyles from './Column.module.css';

import Modal from './Modal.js';

export default class Column extends Component {
  state = {
    tempColumn: this.props.column,
    showDialog: false,
    showEdit: false,
  };
  render() {
    const {height, column} = this.props;
    const { tempColumn, showDialog, showEdit } = this.state;
    const styles = {...elementStyles, ...columnStyles};
    return (
      <div
        onMouseEnter={this.showDialog}
        onMouseLeave={this.hideDialog}
        className={styles.column}>
        {column}
        <div style={{height}} className={styles.columnLine} />
        {showDialog && (
          <div style={{left: 0, top: 0}} className={styles.dialog}>
            <button onClick={this.startEdit} className={styles.button}>
              ✎
            </button>
            <button
              onClick={this.props.removeColumn}
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
                  value={tempColumn}
                  ref={el => this.el = el}
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
  showDialog = () => this.setState({showDialog: true});
  hideDialog = () => this.setState({showDialog: false});
  startEdit = () => this.setState({showEdit: true}, () => this.el.focus());
  saveEdit = () => {
    this.props.updateColumn(this.state.tempColumn);
    this.setState({showEdit: false});
  };
  cancelEdit = () => {
    this.setState({
      tempColumn: this.props.column,
    });
    this.setState({showEdit: false});
  };
  changeLabel = e => this.setState({tempColumn: e.target.value});
}
