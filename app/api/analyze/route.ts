

import { NextRequest, NextResponse } from "next/server";
import { buildInvestmentResearchGraph } from "@/agents/graph";
import { createInitialState } from "@/agents/state";


export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const companyName: string | undefined = body?.companyName?.trim();

    if (!companyName) {
      return NextResponse.json(
        { error: "companyName is required in the request body." },
        { status: 400 }
      );
    }
      
    const graph = buildInvestmentResearchGraph();
    const initialState = createInitialState(companyName);

    const finalState = await graph.invoke(initialState as unknown as Record<string, unknown>);

    return NextResponse.json(finalState, { status: 200 });
  } catch (err: any) {
    console.error("POST /api/analyze failed:", err);
    return NextResponse.json(
      {   
        error:
          err?.message ??
          "Something went wrong while analyzing this company. Please try again."
      },
      { status: 500 }
    );
  }
}