import React,{Component} from 'react';
import {Provider} from 'react-redux';
import Store from '../store/Store';
import SmartContainer from './SmartContainer';

export default class RootContainer extends Component{
    render(){
        return(
            <Provider store={Store} >
                <SmartContainer commonParams={this.props.commonParams}/>
            </Provider>
        );
    }
}

