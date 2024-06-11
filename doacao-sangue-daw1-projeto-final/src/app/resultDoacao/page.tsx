"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import { Doacao } from "@prisma/client";

const columns = [
  { key: "codigo", label: "Código" },
  { key: "nome", label: "Nome do Doador" },
  { key: "volume", label: "Volume (mL)" },
  { key: "tipoSanguineo", label: "Tipo Sanguíneo (com RH)" },
  { key: "data", label: "Data" },
];

export default function ResultDoador() {
  const searchParams = useSearchParams();
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  useEffect(() => {
    const fetchDoadores = async () => {
      const response = await fetch("/api/doacao?" + searchParams.toString());
      let data: Doacao[] = await response.json();
      const start = searchParams.get("start");
      const end = searchParams.get("end");
      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        data = data.filter((doacao) => {
          const doacaoDate = new Date(doacao.data);
          return doacaoDate >= startDate && doacaoDate <= endDate;
        });
      }
      setDoacoes(data);
      setLoading(false);
    };

    fetchDoadores();
  }, [searchParams]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return doacoes.slice(start, start + rowsPerPage);
  }, [page, doacoes]);

  const renderCell = useCallback((doacao:any, columnKey:any) => {
    const cellValue = doacao[columnKey];
    switch (columnKey) {
      case "tipoSanguineo":
        return <span className="w-full text-center">{`${cellValue} ${doacao.rh === "POSITIVO" ? "+" : "-"}`}</span>;
      case "nome":
        return <span className="w-full text-center">{doacao.doador.nome}</span>;
      case "data":
        return <span className="w-full text-center">{`${doacao.data.split("-").reverse().join("/")} ${doacao.hora.slice(0, 5)}`}</span>;
      default:
        return cellValue;
    }
  }, []);

  return (
    <main>
      {loading ? (
        <Spinner className="mb-3" />
      ) : (
        <>
          <Table className="w-[800px] h-[500px]" topContent={<Button className="w-max"><Link href="/resultDoacao">Tirar Filtros</Link></Button>}>
            <TableHeader columns={columns}>
              {column => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={items}>
              {item => (
                <TableRow key={item.codigo}>
                  {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
          {Math.ceil(doacoes.length / rowsPerPage) > 1 && (
            <Pagination page={page} total={Math.ceil(doacoes.length / rowsPerPage)} onChange={setPage} />
          )}
        </>
      )}
    </main>
  );
}
