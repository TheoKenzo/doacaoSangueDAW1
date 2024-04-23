enum TipoSanguineo {
    "A",
    "B",
    "AB",
    "O",
}

enum RH {
    "POSITIVO",
    "NEGATIVO"
}

export class Doador {
    codigo: number;
    nome: string;
    cpf: string;
    tipoSanguineo: TipoSanguineo;
    rh: RH;
    tipoRhCorretos: boolean;

    constructor(codigo: number, nome: string, cpf: string, tipoSanguineo: TipoSanguineo, rh: RH, tipoRhCorretos: boolean) {
        this.codigo = codigo;
        this.nome = nome;
        this.cpf = cpf;
        this.tipoSanguineo = tipoSanguineo;
        this.rh = rh
        this.tipoRhCorretos = tipoRhCorretos;
    }
}