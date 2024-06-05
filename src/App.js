import React from 'react';
import { RouterProvider} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import root from "./router/root";

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={root}/>
        </QueryClientProvider>
    );
};

export default App;