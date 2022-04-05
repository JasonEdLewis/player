import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Layout from './components/Layouts';
import Home from './components/Home';
import App from './App';
import CreateAlbum from './components/CreateAlbum';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function BaseApp (){
    const styles ={
        width: '100%',
        height: '100%',
        marginLeft: '5%%',
        marginRight: '5%',
        // border: '1px solid'
    }
    return (
    <div style={styles}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="Experience" element={<App />} />
            <Route path="create" element={<CreateAlbum />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
    )

}

ReactDOM.render(<BaseApp  />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
