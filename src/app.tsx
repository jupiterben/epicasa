import * as React from 'react';
import { ipcRenderer } from 'electron';
//renderer

export class App extends React.Component<any, any> {
    indexFiles(e: Event) {
        e.preventDefault();
        ipcRenderer.send('renderer.indexFiles');
    }

    render() {
      return ( <button onClick={ this.indexFiles.bind(this) }>Index Files</button> );
    }
}