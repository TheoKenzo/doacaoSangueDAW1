import { NextResponse, NextRequest } from "next/server"

export async function GET(req:NextRequest) {

    const {searchParams} = req.nextUrl;
    const texto = searchParams.get("texto")
    const inteiro = searchParams.get("inteiro")
    const booleano = searchParams.get("booleano")
    const seletor = searchParams.get("seletor")
    const radios = searchParams.get("radios")

    if(
        texto?.length as number >= 2 && texto?.length as number <= 255 &&
        parseInt(inteiro as string) > 0 && parseInt(inteiro as string) < 1000 &&
        booleano &&
        seletor &&
        radios
        ){

        return NextResponse.json({
            texto,
            inteiro,
            booleano,
            seletor,
            radios
        });
    }

    return NextResponse.json({
        error: "Existem valores inválidos."
    })
}
