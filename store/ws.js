export const state = () => ({
    ws: {}
});

export const mutations = {
    setConnection(state, ws) {
        state.ws = ws;
    }
};
