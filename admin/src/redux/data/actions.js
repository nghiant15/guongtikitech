import {
  SAVE_ID_SALE,
  SAVE_SEED
} from '../actions.js'

export function onSaveID(id) {
  return {
    type: SAVE_ID_SALE,
    payload: { id }
  };
}

export function onSaveSeed(seed) {
  return {
    type: SAVE_SEED,
    payload: { seed }
  };
}
