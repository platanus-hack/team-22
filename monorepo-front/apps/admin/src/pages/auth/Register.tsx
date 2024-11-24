import { useState, SetStateAction } from "react";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { Button } from "@common/components/ui/button";
import {
  registerWithEmailAndPassword,
  createUserProfile,
} from "common/src/api/auth";

type Props = {
  setView: (view: "login" | "register") => void;
};

export default function Register({ setView }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const user = await registerWithEmailAndPassword(email, password);
      if (user) {
        await createUserProfile({ ...user });
      }
    } catch (error) {
      setError("Error al registrar usuario");
    }

    setLoading(false);
  };

  return (
    <form className="flex flex-col text-neutral-800 h-screen w-full *:w-full *:*:w-full p-12 pt-24 items-start justify-between">
      <div className="flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center justify-center size-20">
            <img src="/isotipo.svg" alt="Journie" className="h-12 w-auto" />
          </div>
          <h2 className="text-2xl font-medium">Regístrate en Journie</h2>
        </div>

        <div className="space-y-8 max-w-96">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setEmail(e.target.value)
              }
              className="border-transparent bg-neutral-200/30 shadow-none"
              placeholder="m@journie.com"
              type="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              value={password}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setPassword(e.target.value)
              }
              className="border-transparent bg-neutral-200/30 shadow-none"
              placeholder="********"
              type="password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
            <Input
              id="confirm-password"
              value={confirmPassword}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setConfirmPassword(e.target.value)
              }
              className="border-transparent bg-neutral-200/30 shadow-none"
              placeholder="********"
              type="password"
            />
          </div>

          {error && <p className="text-red-500/80 text-sm font-medium">⚠️ {error}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-4 max-w-96 mx-auto">
        <Button onClick={handleRegister} disabled={loading} variant="primary">
          {loading ? "Registrando..." : "Registrarse"}
        </Button>
        <p className="text-center text-sm text-gray-400 h-10 flex gap-1.5 justify-center items-center">
          Ya tienes una cuenta?{" "}
          <button
            onClick={() => setView("login")}
            className="font-medium text-neutral-800 underline hover:text-neutral-800/80"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </form>
  );
}
