import prisma from "@/lib/db"
import { DoacaoRequestPost } from "@/types/doador-request.interface"
import { RH, TipoSanguineo } from "@prisma/client"



export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const codigo = searchParams.get("codigo");
    const tipoSanguineo = searchParams.get("tipoSanguineo");
    const rh = searchParams.get("rh");

    let filtros: any = {};

    if (codigo) {
        filtros.authorId = Number(codigo);
    }
    if (Object.keys(TipoSanguineo).toString().includes(tipoSanguineo ?? "")) {
        filtros.tipoSanguineo = TipoSanguineo[tipoSanguineo as keyof typeof TipoSanguineo];
    }
    if (Object.keys(RH).toString().includes(rh ?? "")) {
        filtros.rh = RH[rh as keyof typeof RH];
    }

    const doacoes = await prisma.doacao.findMany({
        where: {
            ...filtros,
        },
        select: {
            doador:{
                select:{
                    nome: true
                }
            },
            volume: true,
            data: true,
            tipoSanguineo: true,
            rh: true,
            codigo: true,
            hora: true
        }
    });

    return new Response(JSON.stringify(doacoes), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function POST(req: Request) {
    const { id, volume, data, hora, tipoSanguineo, rh } = await req.json() as DoacaoRequestPost;

    if (!id || !volume || !(new Date(data)) || !(new Date(hora)) || !tipoSanguineo || !rh) {
        return new Response('Parâmetros inválidos', {
            status: 400,
        });
    }
    try {
        const doacao = await prisma.doacao.create({
            data: {
                doador: {
                    connect: {
                        codigo: Number(id)
                    }
                },
                volume: Number(volume),
                data: data, 
                hora: hora,
                rh: rh,
                tipoSanguineo: tipoSanguineo,
            }
        });
    } catch (error) {
        console.error(error);
        return new Response("Erro ao salvar doação", { status: 500 });
    }

    return new Response("Doação salva com sucesso", { status: 200 });
}