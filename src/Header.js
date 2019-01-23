import React, {Component} from 'react';
import elementStyles from './Element.module.css';
import headerStyles from './Header.module.css';
import Modal from './Modal.js';
import share from './share.png';

export default class Header extends Component {
  state = {
    tempTitle: this.props.title,
    showDialog: false,
    showEdit: false,
  };
  render() {
    const styles = { ...elementStyles, ...headerStyles };
    const {title} = this.props;
    const {tempTitle, showDialog, showEdit} = this.state;
    return (
      <div
        style={{position: 'relative'}}
        onMouseEnter={this.showDialog}
        onMouseLeave={this.hideDialog}>
        <div className={styles.header}>
          <h1>{title}</h1>
          <span className={styles.share}>
            <button onClick={this.new} style={{color: "#0074D9"}} className={styles.button}>
              New
            </button>
          </span>
          <span className={styles.share}>
            <button onClick={this.props.share} style={{color: "#0074D9"}} className={styles.button}>
              <img alt="Share" src={share} /> Share
            </button>
          </span>
        </div>
        {showDialog && (
          <div style={{top: 40}} className={styles.dialog}>
            <button onClick={this.startEdit} className={styles.button}>
              ✎
            </button>
          </div>
        )}
        {showEdit && (
          <Modal>
            <div className={`${styles.modalContent}`}>
              <div className={styles.inputBlock}>
                <span>Label: </span>
                <input
                  className={styles.input}
                  onChange={this.changeTitle}
                  type="text"
                  value={tempTitle}
                  ref={el => (this.el = el)}
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
  new = () => window.location.href = '/';
  showDialog = () => this.setState({showDialog: true});
  hideDialog = () => this.setState({showDialog: false});
  startEdit = () => this.setState({showEdit: true}, () => this.el.focus());
  saveEdit = () => {
    this.props.updateTitle(this.state.tempTitle);
    this.setState({showEdit: false});
  };
  cancelEdit = () => {
    this.setState({
      tempTitle: this.props.title,
    });
    this.setState({showEdit: false});
  };
  changeTitle = e => this.setState({tempTitle: e.target.value});
}
