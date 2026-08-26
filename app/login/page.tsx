"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (email === "admin@stockbridge.com" && senha === "123456") {
      localStorage.setItem("user", JSON.stringify({ email }));
      router.push("/dashboard");
    } else {
      alert("Credenciais inválidas!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 via-black to-blue-900">
      <div className="backdrop-blur-lg bg-white/10 border border-blue-500/30 p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800/70 text-white focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800/70 text-white focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
        >
          Entrar
        </button>

        <p className="text-sm text-gray-300 mt-4 text-center">
          Não tem conta?{" "}
          <Link href="/cadastro" className="text-blue-400 hover:text-purple-400 transition">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
