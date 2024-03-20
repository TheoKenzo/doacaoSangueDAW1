import { NextResponse, NextRequest } from "next/server"

export async function GET(req:NextRequest) {

    const {searchParams} = req.nextUrl;
    const texto = searchParams.get("texto")
    const inteiro = searchParams.get("inteiro")
    const booleano = searchParams.get("booleano")
    const seletor = searchParams.get("seletor")
    const radios = searchParams.get("radios")

    return NextResponse.json({
        texto,
        inteiro,
        booleano,
        seletor,
        radios
    });

}