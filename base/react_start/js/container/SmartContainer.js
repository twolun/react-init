import B5MApp from 'b5m_app';
import b5m from 'b5m_host';
import 'common.scss';
import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect,Provider} from 'react-redux';

import * as actions from '../action/Action';
import Store from '../store/Store';

//import components here

class SmartContainer extends Component{
    constructor(props) {
        super(props);
        this.state = this.props;
    }
    componentWillMount(){
        let {dispatch,smartData,commonParams} = this.props;
        smartData.commonParams = commonParams;
        console.log('commonParams : ',commonParams)
        //dispatch(actions.init());
    }
    render(){
        console.log('render data : ',this.props);
        return(
            //component here
            <div />
        )
    }
}

function mapStateToProps(state){
    return {
        smartData:state.SmartReducer
    }
}
export default connect(mapStateToProps)(SmartContainer);
