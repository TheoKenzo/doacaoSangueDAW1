import { RH, TipoSanguineo } from '@prisma/client';

export interface DoadorRequestPost{
    nome:string
    cpf: string
    contato: string
    tipoSanguineo: keyof typeof TipoSanguineo
    rh: keyof typeof RH,
    tipoRhCorretos: string
}

export interface DoacaoRequestPost{
    id: number,
    volume: number,
    data: string,
    hora: string,
    rh: RH,
    tipoSanguineo: TipoSanguineo,
}