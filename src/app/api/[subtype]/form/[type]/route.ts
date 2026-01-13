import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";

/* =========================================================
   Upload helper
========================================================= */
async function uploadToBlob(file: File) {
  const blob = await put(`${Date.now()}-${file.name}`, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: file.type,
  });

  return blob.url;
}

/* =========================================================
   UPSERT (POST e PUT usam o mesmo código)
========================================================= */
async function handleUpsert(
  req: NextRequest,
  context: { params: Promise<{ type: string; subtype: string }> }
) {
  const { type, subtype } = await context.params;
  const form = await req.formData();

  const rawValues = form.get("values");
  const values = rawValues ? JSON.parse(rawValues as string) : [];
  const safeValues = Array.isArray(values) ? values : [];

  // uploads
  for (let i = 0; i < safeValues.length; i++) {
    const file = form.get(`file${i}`) as File | null;
    if (file && file.size > 0) {
      const url = await uploadToBlob(file);
      safeValues[i].image = url;
    }
  }

  // 🔥 UPSERT POR type + subtype
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

/* =========================================================
   POST
========================================================= */
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

/* =========================================================
   PUT
========================================================= */
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

/* =========================================================
   GET
========================================================= */
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

/* =========================================================
   DELETE
========================================================= */
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
