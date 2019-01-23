import React, {Component} from 'react';
import Element from './Element.js';
import styles from './App.module.css';
import Group from './Group.js';
import Header from './Header.js';
import Column from './Column.js';
import Modal from './Modal.js';

const ROW_HEIGHT = 28;
const DEFAULT_DATA = {
  title: 'title',
  columns: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  groups: [
    {
      label: 'Some text',
      rows: [
        {
          elements: [
            {
              label: 'something1 lkj',
              color: '#FF4136',
              border: '#85144b',
              width: 150,
            },
            {
              label: 'something2',
              color: '#FF4136',
              border: '#0074D9',
              width: 250,
            },
            {
              label: 'something2',
              color: '#0074D9',
              width: 120,
            },
            {
              label: 'something2',
              color: '#85144b',
              width: 120,
            },
          ],
        },
        {
          elements: [
            {
              label: 'something3',
              color: '#FF4136',
              width: 200,
            },
          ],
        },
      ],
    },
    {
      label: 'Some texxt 2',
      rows: [
        {
          elements: [
            {
              label: 'something4',
              color: '#0074D9',
              width: 120,
            },
          ],
        },
      ],
    },
  ],
};

function getShareUrl(title, groups, columns) {
  const search =
    '?' +
    encodeURIComponent(
      btoa(
        JSON.stringify({
          title,
          groups,
          columns,
        }),
      ),
    );

  const newurl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    search;

  return newurl;
}

function serializeState(key, title, groups, columns) {
  const search =
    '?' +
    encodeURIComponent(
      btoa(
        JSON.stringify({
          key,
        }),
      ),
    );

  localStorage.setItem(
    key,
    JSON.stringify({
      title,
      groups,
      columns,
    }),
  );

  const newurl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    search;
  window.history.pushState({path: newurl}, '', newurl);
}

class App extends Component {
  state = {
    showShare: false,
    title: DEFAULT_DATA.title,
    groups: DEFAULT_DATA.groups,
    columns: DEFAULT_DATA.columns,
    key: new Date().getTime(),
  };
  componentDidMount() {
    try {
      let data = JSON.parse(
        atob(decodeURIComponent(window.location.search.substring(1))),
      );
      let key = data.key || this.state.key;

      if (data.key) {
        data = JSON.parse(localStorage.getItem(data.key));
      }

      this.setState({
        key,
        title: data.title,
        columns: data.columns,
        groups: data.groups,
      });
    } catch (error) {
    }
  }
  render() {
    const {showShare, title, groups, columns} = this.state;
    const height = groups.reduce((height, group) => {
      return height + 10 + group.rows.length * (ROW_HEIGHT + 12);
    }, 2);
    return (
      <div className={styles.buttonWrapper} style={{margin: 24}}>
        <Header
          columns={columns}
          share={this.share}
          title={title}
          updateTitle={this.updateTitle}
          updateColumns={this.updateColumns}
        />
        <div
          style={{
            position: 'relative',
            border: '2px solid #666',
            width: 1024,
            marginLeft: 120,
          }}>
          <div className={styles.wrapper}>
            {columns.map((column, index) => (
              <Column
                updateColumn={this.updateColumn.bind(this, index)}
                removeColumn={this.removeColumn.bind(this, index)}
                height={height}
                column={column}
                key={index}
              />
            ))}
          </div>
          <button
            style={{
              position: 'absolute',
              fontSize: 14,
              top: 3,
              right: -100,
              fontWeight: 'bold',
            }}
            onClick={this.addColumn}
            className={styles.button}>
            Add column
          </button>
          {groups.map((group, index) => {
            return (
              <React.Fragment key={index}>
                <hr style={{marginTop: 0}} />
                <Group
                  updateGroup={newGroup => this.updateGroup(group, newGroup)}
                  removeGroup={() => this.removeGroup(group)}
                  group={group}
                />
                {group.rows.map((row, index) => {
                  return (
                    <React.Fragment key={index}>
                      <div className={styles.row}>
                        {row.elements.map((element, index) => {
                          return (
                            <Element
                              key={index}
                              removeElement={() =>
                                this.removeElement(group, row, element)
                              }
                              updateElement={newElement =>
                                this.updateElement(
                                  group,
                                  row,
                                  element,
                                  newElement,
                                )
                              }
                              height={ROW_HEIGHT}
                              element={element}
                            />
                          );
                        })}
                        <button
                          onClick={() => this.addElement(group, row)}
                          className={styles.button}>
                          +
                        </button>
                      </div>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
        <button
          style={{fontSize: 14, marginLeft: 18, fontWeight: 'bold'}}
          onClick={this.addGroup}
          className={styles.button}>
          Add group
        </button>
        {showShare && (
          <Modal>
            <div className={styles.modalContent}>
              <div className={styles.inputBlock}>
                <span>Share URL: </span>
                <input
                  className={styles.input}
                  style={{width: 300}}
                  type="text"
                  value={getShareUrl(title, groups, columns)}
                  ref={el => (this.el = el)}
                />
              </div>
              <div className={styles.action}>
                <button
                  onClick={this.closeShare}
                  className={`${styles.save} ${styles.primary}`}>
                  Done
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
  addElement(groupToChange, rowToChange) {
    const groups = this.state.groups.map(group => {
      if (group === groupToChange) {
        return {
          ...group,
          rows: group.rows.map(row => {
            if (row === rowToChange) {
              return {
                ...row,
                elements: [
                  ...row.elements,
                  {
                    label: 'New task',
                    color: '#0074D9',
                    width: 80,
                  },
                ],
              };
            } else return row;
          }),
        };
      } else return group;
    });
    this.setState({groups}, this.serializeState);
  }
  updateElement(groupToChange, rowToChange, elementToChange, newElement) {
    const groups = this.state.groups.map(group => {
      if (group === groupToChange) {
        return {
          ...group,
          rows: group.rows.map(row => {
            if (row === rowToChange) {
              return {
                ...row,
                elements: row.elements.map(element => {
                  if (element === elementToChange) {
                    return newElement;
                  } else return element;
                }),
              };
            } else return row;
          }),
        };
      } else return group;
    });
    this.setState({groups}, this.serializeState);
  }
  removeElement(groupToChange, rowToChange, elementToRemove) {
    const groups = this.state.groups.map(group => {
      if (group === groupToChange) {
        return {
          ...group,
          rows: group.rows.map(row => {
            if (row === rowToChange) {
              return {
                ...row,
                elements: row.elements.filter(
                  element => element !== elementToRemove,
                ),
              };
            } else return row;
          }),
        };
      } else return group;
    });
    this.setState({groups}, this.serializeState);
  }
  addGroup = () => {
    const newRow = {elements: []};
    const newGroup = {
      label: 'New group',
      rows: [newRow],
    };
    this.setState(
      {
        groups: [...this.state.groups, newGroup],
      },
      () => this.addElement(newGroup, newRow),
    );
  };
  removeGroup(groupToRemove) {
    this.setState(
      {
        groups: this.state.groups.filter(group => group !== groupToRemove),
      },
      this.serializeState,
    );
  }
  updateGroup(groupToUpdate, newGroup) {
    this.setState(
      {
        groups: this.state.groups.map(group =>
          group === groupToUpdate ? newGroup : group,
        ),
      },
      this.serializeState,
    );
  }
  serializeState() {
    serializeState(
      this.state.key,
      this.state.title,
      this.state.groups,
      this.state.columns,
    );
  }
  share = () => this.setState({showShare: true}, () => this.el.select());
  closeShare = () => this.setState({showShare: false});
  updateTitle = title => this.setState({title}, this.serializeState);
  addColumn = () =>
    this.setState({columns: [...this.state.columns, '']}, this.serializeState);
  updateColumn = (index, column) => {
    const columns = this.state.columns;
    columns[index] = column;
    this.setState({columns}, this.serializeState);
  };
  removeColumn = index => {
    const columns = this.state.columns;
    columns.splice(index, 1);
    this.setState({columns}, this.serializeState);
  };
}

export default App;
