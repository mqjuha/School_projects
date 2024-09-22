import {
    ADD_TO_CART,
    REDUCE_QUANTITY,
    ADD_QUANTITY,
    CLEAR_CART,
} from '../constants';
  
const initialState = {
    items: [], // Ostoskorin tuotteet
};
  
const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const product = action.payload;

            // Tarkistetaan, onko tuote jo ostoskorissa. Jos tuotetta ei löydy arvo on -1
            const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);

            // Jos tuote löytyy, lisätään määrää yhdellä
            if (existingItemIndex !== -1) {
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex].quantity += 1;
                return { ...state, items: updatedItems };
            }
            // Jos tuote ei ole vielä lisätty, lisätään yksi
            else {
                const quantity = 1;
                return { ...state, items: [...state.items, { product, quantity }] };
            }
  
        case REDUCE_QUANTITY:
            const productId = action.payload;
            
            const item = state.items.find(item => item.product.id === productId);

            // Jos määrä on 1, poistetaan ostoskorista
            if (item && item.quantity === 1) {
                return {
                ...state,
                items: state.items.filter(item => item.product.id !== productId)
                };
            }
            // Muussa vähennetään yhdellä
            return {
                ...state,
                items: state.items.map(item =>
                item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
            };
        
        case ADD_QUANTITY:
            const productIdToAdd = action.payload;
            return {
                ...state,
                items: state.items.map(item =>
                item.product.id === productIdToAdd ? { ...item, quantity: item.quantity + 1 } : item
                )
            };
  
        case CLEAR_CART:
            return { ...state, items: [] };
  
        default:
            return state;
    }
};
  
export default cartReducer;
  