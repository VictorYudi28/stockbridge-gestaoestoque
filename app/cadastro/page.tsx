"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Cadastro: React.FC = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const router = useRouter();

  const handleCadastro = () => {
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    alert("Usuário cadastrado com sucesso!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 via-black to-purple-900">
      <div className="backdrop-blur-lg bg-white/10 border border-indigo-500/30 p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">Cadastro</h2>
        {/* Inputs */}
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800/70 text-white focus:ring-2 focus:ring-indigo-500 transition"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800/70 text-white focus:ring-2 focus:ring-indigo-500 transition"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800/70 text-white focus:ring-2 focus:ring-indigo-500 transition"
        />
        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg bg-gray-800/70 text-white focus:ring-2 focus:ring-indigo-500 transition"
        />
        <button
          onClick={handleCadastro}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
        >
          Cadastrar
        </button>

        {/* Botão para Login usando router */}
        <p className="text-sm text-gray-300 mt-4 text-center">
          Já tem uma conta?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-indigo-400 hover:text-purple-400 cursor-pointer transition"
          >
            Entrar
          </span>
        </p>
      </div>
    </div>
  );
};

export default Cadastro;

