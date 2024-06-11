import { DoadorRequestPost } from "@/types/doador-request.interface"
import prisma from "@/lib/db"
import { Doador, RH, TipoSanguineo } from "@prisma/client"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest){
    const { searchParams } = req.nextUrl;
    const codigo = searchParams.get("codigo");
    const nome = searchParams.get("nome");
    const cpf = searchParams.get("cpf");
    const contato = searchParams.get("contato");
    const tipoSanguineo = searchParams.get("tipoSanguineo");
    const rh = searchParams.get("rh");
    const tipoRhCorretos = searchParams.get("tipoRhCorretos");

    let filtros: any = {};

    // Verifica cada parâmetro e adiciona ao objeto de filtros se estiver definido
    if (codigo) {
        filtros.codigo = Number(codigo);
    }
    if (nome) {
        filtros.nome = nome;
    }
    if (cpf) {
        filtros.cpf = cpf;
    }
    if (contato) {
        filtros.contato = contato;
    }
    if (Object.keys(TipoSanguineo).toString().includes(tipoSanguineo ?? "")) {
        filtros.tipoSanguineo = TipoSanguineo[tipoSanguineo as keyof typeof TipoSanguineo];
    }
    if (Object.keys(RH).toString().includes(rh ?? "")) {
        filtros.rh = RH[rh as keyof typeof RH];
    }
    if (tipoRhCorretos) {
        filtros.tipoRhCorretos = tipoRhCorretos === "true";
    }

    const doadores = await prisma.doador.findMany({
        where: {
            ...filtros,
            ativo: true,
            nome: {
                contains: filtros.nome
            }
        },
        
    });

    return new Response(JSON.stringify(doadores), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
export async function POST(req: Request) {
    const { nome, cpf, contato, tipoSanguineo, rh, tipoRhCorretos } = await req.json() as DoadorRequestPost

    // Verifica cada parâmetro e adiciona ao objeto de filtros se estiver definido
    if (!nome || !cpf || !contato || !Object.values(TipoSanguineo).includes(tipoSanguineo) || !Object.values(RH).includes(rh)) {
        return new Response('Parâmetros inválidos', {
            status: 400,
        });
    }

    try {
        const doador = await prisma.doador.create({
            data:{
                nome: nome,
                cpf: cpf,
                contato: contato,
                tipoSanguineo: tipoSanguineo,
                rh: rh,
                tipoRhCorretos: Boolean(tipoRhCorretos)
            }
        });

        return new Response(JSON.stringify(doador), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        console.error(error);
        return new Response(`Erro ao salvar doador: ${error.message}`, {
            status: 400,
        });
    }
}

export async function DELETE(req: NextRequest): Promise<Response> {
    const codigo = req.nextUrl.searchParams.get("codigo");

    if (!codigo) {
        console.log(codigo);
        return new Response('Parâmetros inválidos', {
            status: 400,
        });
    }

    try {
        const doadorDeletado = await prisma.doador.update({
            where: {
                codigo: Number(codigo),
            },
            data: {
                ativo: false,
            }
        });

        if (!doadorDeletado) {
            return new Response('Doador não encontrado', {
                status: 404,
            });
        }

        return new Response('Doador deletado com sucesso', {
            status: 200,
        });
    } catch (error: any) {
        return new Response(`Erro ao deletar doador: ${error.message}`, {
            status: 400,
        });
    }
}

export async function PUT(req: Request): Promise<Response> {
    const { codigo, nome, cpf, contato, tipoSanguineo, rh , tipoRhCorretos } = await req.json();

    let data: Partial<Doador> = {};

    if (nome) {
        data.nome = nome;
    }
    if (cpf) {
        data.cpf = cpf;
    }
    if (contato) {
        data.contato = contato;
    }
    if (tipoSanguineo) {
        data.tipoSanguineo = tipoSanguineo;
    }
    if (rh) {
        data.rh = rh;
    }
    data.tipoRhCorretos = Boolean(tipoRhCorretos);

    if (Object.keys(data).length === 0) {
        return new Response('Parâmetros inválidos', {
            status: 400,
        });
    }

    try {
        const doadorAtualizado = await prisma.doador.update({
            where: {
                codigo: Number(codigo),
            },
            data: data
        });

        if (!doadorAtualizado) {
            return new Response('Doador não encontrado', {
                status: 404,
            });
        }

        return new Response('Doador atualizado com sucesso', {
            status: 200,
        });
    } catch (error: any) {
        return new Response(`Erro ao atualizar doador: ${error.message}`, {
            status: 400,
        });
    }
}

