let initState = ({})

export default function SmartReducer(state = initState, action) {
    let {actionType} = action;
    switch(actionType){
        default:
            return Object.assign({},state);
    }
}
