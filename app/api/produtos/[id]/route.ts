import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI!);
    const db = client.db("retailtech");

    // Usa o _id gerado pelo Mongo
    const resultado = await db.collection("produtos").deleteOne({
      _id: new ObjectId(params.id),
    });

    client.close();

    if (resultado.deletedCount === 0) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Produto removido com sucesso!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao remover produto" },
      { status: 500 },
    );
  }
}
