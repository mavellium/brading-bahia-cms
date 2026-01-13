import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";

async function uploadToBlob(file: File) {
  const blob = await put(`${Date.now()}-${file.name}`, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: file.type,
  });

  return blob.url;
}

async function handleUpsert(
  req: NextRequest,
  context: { params: Promise<{ type: string; subtype: string }> }
) {
  const { type, subtype } = await context.params;
  const form = await req.formData();

  const rawValues = form.get("values");
  const values = rawValues ? JSON.parse(rawValues as string) : [];
  const safeValues = Array.isArray(values) ? values : [];

  // Processar uploads de arquivos
  for (let i = 0; i < safeValues.length; i++) {
    const file = form.get(`file${i}`) as File | null;
    if (file && file.size > 0) {
      const url = await uploadToBlob(file);
      
      // IMPORTANTE: Para o tipo "highlights", salvar no campo "video"
      // Para outros tipos, pode salvar no campo "image" como antes
      if (type === "highlights") {
        safeValues[i].video = url;
      } else {
        safeValues[i].image = url;
      }
    }
  }

  // UPSERT POR type + subtype
  const record = await prisma.formData.upsert({
    where: {
      type_subtype: {
        type,
        subtype,
      },
    },
    update: {
      values: safeValues,
    },
    create: {
      type,
      subtype,
      values: safeValues,
    },
  });

  return NextResponse.json(record);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ type: string; subtype: string }> }
) {
  try {
    return await handleUpsert(req, context);
  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ type: string; subtype: string }> }
) {
  try {
    return await handleUpsert(req, context);
  } catch (err) {
    console.error("PUT ERROR:", err);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ type: string; subtype: string }> }
) {
  const { type, subtype } = await context.params;

  const record = await prisma.formData.findUnique({
    where: {
      type_subtype: { type, subtype },
    },
  });

  return NextResponse.json(record ?? null);
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ type: string; subtype: string }> }
) {
  const { type, subtype } = await context.params;

  await prisma.formData.delete({
    where: {
      type_subtype: { type, subtype },
    },
  });

  return NextResponse.json({ success: true });
}