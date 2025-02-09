import { useMemo } from "react";
import { BrowserRouter } from "react-router";
import {MutationCache, QueryCache, QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {toast, ToastContainer} from "react-toastify";
import { RestApiClient } from "./api/ApiClient";
import Header from "./components/Header";
import Routing from "./Routing";
import AppInitializer from "./AppInitializer";
import { ApiProvider } from "./providers/ApiProvider";
import SessionsRestApi from "./api/SessionsApi";
import AgentTeamsRestApi from './api/AgentTeamsApi';
import AgentsRestApi from "./api/AgentsApi";

import './tailwind.css';

function App() {
  const queryClient = useMemo(() => {
    return new QueryClient({
      queryCache: new QueryCache({
        onError: (error) => {
          toast.error(error.message)
        },
      }),
      mutationCache: new MutationCache({
        onError: (error) => toast.error(error.message),
      }),
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          refetchIntervalInBackground: false,
        },
      },
    });
  }, []);

  const services = useMemo(() => {
    const apiClient = new RestApiClient(import.meta.env.VITE_API_URL);

    return {
      sessionsApi: new SessionsRestApi(apiClient),
      agentTeamsApi: new AgentTeamsRestApi(apiClient),
      agentApi: new AgentsRestApi(apiClient),
    };
  }, []);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ApiProvider value={services}>
          <AppInitializer>
            <Header />
            <Routing />
          </AppInitializer>
        </ApiProvider>
      </QueryClientProvider>
      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        theme="dark"
        toastStyle={{ zIndex: 1000000 }}
        position="top-right"
      />
    </BrowserRouter>
  )
}

export default App
