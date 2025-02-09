import type { MetaFunction } from '@remix-run/node';
import Button from "~/components/Button";

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

const Home = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <div className="p-4">
          <h1 className="text-4xl font-bold text-center">
            Automate tasks, enhance collaboration, and unlock new possibilities with intelligent AI agents.
          </h1>
        </div>
        <Button>Get Started</Button>
      </div>
    </div>
  );
};

export default Home;
