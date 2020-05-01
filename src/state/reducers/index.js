import { reducer as selectionReducer } from './selection';

export function reducer(state, payload) {
  switch (payload.type) {
    case 'select':
    case 'deselect':
    case 'reselect':
      return selectionReducer(state, payload);

    case 'filter':
      return { ...state, filter: payload.filter.toLowerCase() };
  }
}
