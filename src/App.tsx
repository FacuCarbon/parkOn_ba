import { UserProvider, useUser } from "./context/UserContext";
import { AuthScreen } from "./screens/AuthScreen";
import { DriverApp } from "./screens/DriverApp";

function App() {
  return (
    <UserProvider>
      <AppGate />
    </UserProvider>
  );
}

function AppGate() {
  const { currentUser } = useUser();

  return currentUser ? <DriverApp /> : <AuthScreen />;
}

export default App;
