import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function AuthPage() {
  const [view, setView] = useState<"login" | "register">("login");

  return (
    <div>
      {view === "register" ? (
        <div>
          <Register setView={setView} />
        </div>
      ) : (
        <div>
          <Login setView={setView} />
        </div>
      )}
    </div>
  );
}
