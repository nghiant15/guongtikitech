import {
  SAVE_ID_SALE,
  SAVE_SEED
} from '../actions.js'

const INIT_STATE = {
  test: "Duy 123",
}

export function getData_AllAPI(state = INIT_STATE, action) {
  switch (action.type) {
    case SAVE_ID_SALE: {
      const { id } = action.payload;
      return { ...state, idSale: id }
    }
    case SAVE_SEED: {
      const { seed } = action.payload;
      return { ...state, dataSeeder: seed }
    }
    default: return { ...state }
  }
}

