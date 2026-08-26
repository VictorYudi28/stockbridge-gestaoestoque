import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await MongoClient.connect(process.env.MONGO_URI!);
  const db = client.db("retailtech");
  const produtos = await db.collection("produtos").find().toArray();
  client.close();

  // Converte _id para string antes de enviar
  const lista = produtos.map((p) => ({
    ...p,
    _id: p._id.toString(),
  }));

  return NextResponse.json(lista);
}

export async function POST(request: Request) {
  const novoProduto = await request.json();
  const client = await MongoClient.connect(process.env.MONGO_URI!);
  const db = client.db("retailtech");

  const resultado = await db.collection("produtos").insertOne({
    ...novoProduto,
    estoque: Number(novoProduto.estoque) || 0, // 🔧 garante número
  });

  client.close();

  // Retorna o produto com _id gerado já convertido em string
  return NextResponse.json({
    ...novoProduto,
    _id: resultado.insertedId.toString(),
  });
}
