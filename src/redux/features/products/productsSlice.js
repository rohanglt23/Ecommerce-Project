import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import ProductsData from "./../../ProductData"

const initialState = {
    loading: false,
    value: [], // empty array
    error: ""
}

export const getProducts = createAsyncThunk("getProducts", () => {
    // const response = require('./../../products.json')
    // // console.log(response);
    // // console.log(response.data);
    // // console.log(response.data.products); // Returns a 20-element array where each element is an object.
    return ProductsData.products;
})

export const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getProducts.pending, (state, action) => {
            state.loading = true;
        })

        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.value = action.payload; // api'den gelen verileri value'ya doldurma işlemi
        })

        builder.addCase(getProducts.rejected, (state, action) => {
            state.error = "Bad fetching!"
        })
    }
});

export default productsSlice.reducer;