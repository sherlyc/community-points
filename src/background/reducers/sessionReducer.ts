import { IAction } from 'background/interfaces';
import { ISubReddit } from 'interfaces';

interface SessionState {
  account: string,
  balance: string,
  subReddit: ISubReddit
}

const initialState: SessionState = {
  account: null,
  balance: null,
  subReddit: {
    token: null,
    name: null,
    symbol: null
  }
};

function sessionReducer (
  state: SessionState = initialState,
  action: IAction
): SessionState {
  switch (action.type) {
    case 'SESSION/GET/SUCCESS':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export default sessionReducer;
