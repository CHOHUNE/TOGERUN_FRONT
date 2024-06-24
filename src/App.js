import React from 'react';
import {RouterProvider} from "react-router-dom";
import root from "./router/root";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={root}/>
        </QueryClientProvider>
    );
};

export default App;