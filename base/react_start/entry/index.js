import reactDom from 'react-dom';
import React from 'react';
import B5MApp from 'b5m_app';

import RootContainer from '../js/container/RootContainer';
//commonParams is importent for hybrid
B5MApp.send_message('commonParams',{},function(commonParams){
    reactDom.render(
        <RootContainer commonParams={commonParams}/>
        ,document.getElementById('page')
    );

})




