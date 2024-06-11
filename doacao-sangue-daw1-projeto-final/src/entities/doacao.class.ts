class Doacao {
    codigo: number;
    data: Date;
    hora: Date;
    volume: number;

    constructor(codigo: number, data: Date, hora: Date, volume: number) {
        this.codigo = codigo;
        this.data = data;
        this.hora = hora;
        this.volume = volume;
    }
}