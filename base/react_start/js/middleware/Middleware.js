import B5MApp from 'b5m_app';

export default store => next => action => {
    const callApi = action;
    if (typeof callApi === undefined) {
        return next(action);
    }
    //get commonParams
    let {commonParams} = store.getState().SmartReducer;
    //fetch here
    return next(action);
}
