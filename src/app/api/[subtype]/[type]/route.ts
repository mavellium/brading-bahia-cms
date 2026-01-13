// src/app/api/[subtype]/[type]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ type: string; subtype: string }> }
) {
  try {
    const { subtype, type } = await context.params;

    const formData = await prisma.formData.findUnique({
      where: {
        type_subtype: {
          type,
          subtype,
        },
      },
      select: {
        values: true,
      },
    });

    if (!formData) {
      return NextResponse.json(
        null,
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      formData.values,
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500, headers: corsHeaders }
    );
  }
}
