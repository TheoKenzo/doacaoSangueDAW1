interface searchParamsProps {
    texto?: string,
    inteiro?: number,
    booleano?: boolean,
    seletor?: number,
    radios?: string
}

export default function api({searchParams}: {searchParams: searchParamsProps}) {
    // Construct the object with all properties
    const result = {
        texto: searchParams.texto,
        inteiro: searchParams.inteiro,
        booleano: searchParams.booleano,
        seletor: searchParams.seletor,
        radios: searchParams.radios
    };

    // Filter out undefined properties
    const filteredResult = Object.fromEntries(
        Object.entries(result).filter(([key, value]) => value !== undefined)
    );

    // Return the filtered object as JSON
    return JSON.stringify(filteredResult);
}
