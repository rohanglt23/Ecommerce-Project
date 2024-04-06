import { createSlice } from '@reduxjs/toolkit';
import { toast } from "react-hot-toast";

function fetchFromLocalStorage() {
    let value = localStorage.getItem("value");
    if (value) {
        return JSON.parse(value);
    }
    else {
        return []; // empty array
    }
}

function storeInLocalStorage(data) {
    localStorage.setItem("value", JSON.stringify(data));
}

const initialState = {
    value: fetchFromLocalStorage(),
}

export const navbarSlice = createSlice({
    name: "navbar",
    initialState,
    reducers: {
        clear: (state, action) => {
            state.value = [];
            storeInLocalStorage(state.value)
        },
        add: (state, action) => {
            const existingProduct = state.value.find(eachProduct => eachProduct.id === action.payload.id);

            if (existingProduct) {
                existingProduct.quantity += 1; // Sepetteki adedini artır
                // console.log(existingProduct.quantity, "quantity");
            }

            state.value = [...state.value, { ...action.payload, quantity: 1 }];

            // Sepette sadece bir kere göstermek için, aynı ürünleri birleştir
            const uniqueProducts = state.value.filter((product, index, self) =>
                index === self.findIndex(p => p.id === product.id)
            );

            state.value = uniqueProducts;
            storeInLocalStorage(state.value);
            toast.success("Product is added!");
        },

        remove: (state, action) => {
            const index = state.value.findIndex(product => product.id === action.payload);

            if (index !== -1) {
                state.value.splice(index, 1); 

                storeInLocalStorage(state.value);
                toast.success("Product is removed!");
            }
        },

        removeOne: (state, action) => {
            const index = state.value.findIndex(product => product.id === action.payload);

            if (index !== -1) {
                if (state.value[index].quantity > 1) {
                    state.value[index].quantity -= 1;

                    storeInLocalStorage(state.value);
                    toast.success("Product is removed!");
                }
            }
        }
    },
});

export const { add, remove, removeOne, clear } = navbarSlice.actions;

export default navbarSlice.reducer;
