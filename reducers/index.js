import { RECEIVE_ENTRIES, ADD_ENTRY } from "../actions";

function entries(state = {}, action) {
  switch (action.type) {
    case ADD_ENTRY:
      return {
        ...state,
        ...action.entry
      };
    case RECEIVE_ENTRIES:
      return {
        ...state,
        ...action.entries
      };
    default:
      return state;
  }
}

export default entries;
