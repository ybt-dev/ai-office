import { Route, Routes } from 'react-router';
import AuthorizedSection from '@/components/AuthorizedSection';
import Home from './routes/home';
import AgentTeamDetails from './routes/agent-team-details';
import SignInPage from './routes/sign-in';
import VerifySessionPage from './routes/verify-session';
import AgentTeamsPage from './routes/agent-teams';
import CreateAccount from './routes/create-account';
import Agents from './routes/agents';
import AgentDetails from './routes/agent-details';
import TeamSettings from './routes/team-settings';
import TeamInteractions from './routes/team-interactions';
import TeamInteractionDetails from './routes/team-interaction-details';

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/agent-teams/:agentTeamId"
        element={
          <AuthorizedSection>
            <AgentTeamDetails />
          </AuthorizedSection>
        }
      >
        <Route path="agents" element={<Agents />}>
          <Route path=":agentId" element={<AgentDetails />} />
        </Route>
        <Route path="interactions">
          <Route index element={<TeamInteractions />} />
          <Route path=":interactionId" element={<TeamInteractionDetails />} />
        </Route>
        <Route path="settings" element={<TeamSettings />} />
      </Route>
      <Route
        path="/agent-teams"
        element={
          <AuthorizedSection>
            <AgentTeamsPage />
          </AuthorizedSection>
        }
      />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/session-verification" element={<VerifySessionPage />} />
    </Routes>
  );
};

export default Routing;
