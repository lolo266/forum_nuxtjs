export const state = () => ({
    CategorySelect: null,
    ChildSelect: null,
    TopicSelect: null
})
  
export const mutations = {
    SetCategory(state, data){
        state.CategorySelect = data;
    },
    SetChild(state, data){
        state.ChildSelect = data;
    },
    SetTopic(state, data){
        state.TopicSelect = data;
    },
}