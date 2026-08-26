"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Dashboard: React.FC = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [novoProduto, setNovoProduto] = useState({ nome: "", categoria: "", estoque: 0 });
  const router = useRouter();

  // Proteção de rota
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.replace("/login");
    }
  }, [router]);

  // Buscar produtos do banco
  useEffect(() => {
    fetch("/api/produtos")
      .then((res) => res.json())
      .then((data) => {
        const lista = data.map((p: any) => ({
          ...p,
          _id: p._id?.toString() ?? "",
          estoque: Number(p.estoque) || 0,
          status:
            p.estoque > 50
              ? "Disponível"
              : p.estoque === 0
              ? "Esgotado"
              : "Baixo estoque",
        }));
        setProdutos(lista);
      });
  }, []);

  const kpis = [
    {
      label: "📦 Produtos em Estoque",
      value: produtos.reduce((acc, p) => acc + (Number(p.estoque) || 0), 0),
      color: "border-blue-500/30",
    },
    {
      label: "⚠️ Rupturas",
      value: `${produtos.filter((p) => Number(p.estoque) === 0).length}`,
      color: "border-purple-500/30",
    },
    { label: "🚚 Pedidos em Trânsito", value: "87", color: "border-green-500/30" },
    { label: "⏱️ Tempo Médio de Entrega", value: "36h", color: "border-pink-500/30" },
  ];

  const handleAdicionar = async () => {
    if (!novoProduto.nome || !novoProduto.categoria) {
      alert("Preencha todos os campos!");
      return;
    }

    const produto = {
      ...novoProduto,
      estoque: Number(novoProduto.estoque) || 0,
      status:
        novoProduto.estoque > 50
          ? "Disponível"
          : novoProduto.estoque === 0
          ? "Esgotado"
          : "Baixo estoque",
    };

    // 🔧 Adiciona imediatamente com ID temporário
    const tempId = Math.random().toString(36).substring(2, 9);
    setProdutos([...produtos, { ...produto, _id: tempId }]);

    // Depois confirma com o backend
    const res = await fetch("/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto),
    });

    const novo = await res.json();
    const id = novo._id ? novo._id.toString() : tempId;

    // Substitui o temporário pelo real
    setProdutos((prev) =>
      prev.map((p) => (p._id === tempId ? { ...novo, _id: id, estoque: Number(novo.estoque) || 0 } : p))
    );

    setNovoProduto({ nome: "", categoria: "", estoque: 0 });
  };

  const handleRemover = async (id: string) => {
    await fetch(`/api/produtos/${id}`, { method: "DELETE" });
    setProdutos(produtos.filter((p) => p._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-blue-900 text-white p-10">
      <h1 className="text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Gestão de Estoque - Stock Bridge
      </h1>

      <div className="grid grid-cols-4 gap-6 mb-10">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className={`backdrop-blur-lg bg-white/10 border ${kpi.color} p-6 rounded-xl shadow-lg hover:scale-105 transition-transform`}
          >
            <p className="text-xl font-semibold">{kpi.label}</p>
            <p className="text-3xl font-bold text-blue-300">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="backdrop-blur-lg bg-white/10 border border-green-500/30 p-6 rounded-xl shadow-lg mb-10">
        <h2 className="text-3xl mb-4 text-green-300">➕ Adicionar Produto</h2>
        <input
          type="text"
          placeholder="Nome do produto"
          value={novoProduto.nome}
          onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
          className="w-full p-3 mb-3 rounded-lg bg-gray-800/70 text-white focus:ring-2 focus:ring-green-500 transition"
        />
        <input
          type="text"
          placeholder="Categoria"
          value={novoProduto.categoria}
          onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}
          className="w-full p-3 mb-3 rounded-lg bg-gray-800/70 text-white focus:ring-2 focus:ring-green-500 transition"
        />
        <input
          type="number"
          placeholder="Estoque inicial"
          value={novoProduto.estoque}
          onChange={(e) => setNovoProduto({ ...novoProduto, estoque: Number(e.target.value) })}
          className="w-full p-3 mb-3 rounded-lg bg-gray-800/70 text-white focus:ring-2 focus:ring-green-500 transition"
        />
        <button
          onClick={handleAdicionar}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
        >
          Adicionar
        </button>
      </div>

      <div className="backdrop-blur-lg bg-white/10 border border-blue-500/30 p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl mb-4 text-blue-300">📋 Controle de Produtos</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-indigo-400">
              <th className="p-3">Produto</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Estoque</th>
              <th className="p-3">Status</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p, i) => (
              <tr key={p._id || i} className="hover:bg-gray-800/50 transition">
                <td className="p-3">{p.nome}</td>
                <td className="p-3">{p.categoria}</td>
                <td className="p-3">{p.estoque}</td>
                <td
                  className={`p-3 ${
                    p.status === "Disponível"
                      ? "text-green-400"
                      : p.status === "Esgotado"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {p.status}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleRemover(p._id)}
                    className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-lg shadow-md transition"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
