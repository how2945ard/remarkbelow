import React, { Component } from 'react';
import styles from './Home.css';
import Editor from '../containers/Editor';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container}>
          <Editor />
        </div>
      </div>
    );
  }
}
