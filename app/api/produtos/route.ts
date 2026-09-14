import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// Buscar todos os produtos
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

// Adicionar novo produto
export async function POST(request: Request) {
  const novoProduto = await request.json();
  const client = await MongoClient.connect(process.env.MONGO_URI!);
  const db = client.db("retailtech");

  const resultado = await db.collection("produtos").insertOne({
    ...novoProduto,
    estoque: Number(novoProduto.estoque) || 0, // garante número
  });

  client.close();

  // Retorna o produto com _id gerado já convertido em string
  return NextResponse.json({
    ...novoProduto,
    _id: resultado.insertedId.toString(),
  });
}

// Remover produto
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json(); // pega o id do corpo
    const client = await MongoClient.connect(process.env.MONGO_URI!);
    const db = client.db("retailtech");

    const resultado = await db.collection("produtos").deleteOne({
      _id: new ObjectId(id),
    });

    client.close();

    if (resultado.deletedCount === 1) {
      return NextResponse.json({ sucesso: true, id });
    } else {
      return NextResponse.json({ erro: "Produto não encontrado" }, { status: 404 });
    }
  } catch (error) {
    console.error("Erro ao excluir:", error);
    return NextResponse.json({ erro: "Falha ao excluir produto" }, { status: 500 });
  }
}

// Atualizar produto
export async function PUT(request: Request) {
  try {
    const { id, nome, categoria, estoque } = await request.json();
    const client = await MongoClient.connect(process.env.MONGO_URI!);
    const db = client.db("retailtech");

    // Recalcula status conforme estoque
    const status =
      Number(estoque) > 50
        ? "Disponível"
        : Number(estoque) === 0
        ? "Esgotado"
        : "Baixo estoque";

    const resultado = await db.collection("produtos").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          nome,
          categoria,
          estoque: Number(estoque),
          status,
        },
      }
    );

    client.close();

    if (resultado.modifiedCount === 1) {
      return NextResponse.json({ sucesso: true, id });
    } else {
      return NextResponse.json(
        { erro: "Produto não encontrado ou não alterado" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return NextResponse.json({ erro: "Falha ao atualizar produto" }, { status: 500 });
  }
}
