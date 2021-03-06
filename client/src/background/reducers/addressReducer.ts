import { keyBy } from 'lodash';
import { IUserAddress, IAction } from 'interfaces';

interface AddressState {
  [username: string]: IUserAddress
}

const initialState: AddressState = {};

function addressReducer (
  state: AddressState = initialState,
  action: IAction
): AddressState {
  switch (action.type) {
    case 'USERADDRESSMAP/GET/SUCCESS':
      return { ...state, ...keyBy(action.payload, 'author') };
    default:
      return state;
  }
}

export default addressReducer;
