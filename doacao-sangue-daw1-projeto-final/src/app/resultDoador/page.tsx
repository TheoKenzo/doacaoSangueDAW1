"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Doador } from "@prisma/client";
import Link from "next/link";
import { Pagination } from "@nextui-org/pagination";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { Spinner } from "@nextui-org/spinner";

interface Column {
  key: string;
  label: string;
}

const columns: Column[] = [
  {
    key: "codigo",
    label: "Código",
  },
  {
    key: "nome",
    label: "Nome",
  },
  {
    key: "tipoSanguineo",
    label: "Tipo Sanguíneo (com RH)",
  },
  {
    key: "tipoRhCorretos",
    label: "Tipo Rh Corretos",
  },
  {
    key: "actions",
    label: "Ações",
  },
];

export default function ResultDoador() {
  const searchParams = useSearchParams();
  const [doadores, setDoadores] = useState<Doador[]>([]);
  const [codigo, setCodigo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = React.useState(1);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const rowsPerPage = 7;

  const pages = Math.ceil(doadores.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return doadores.slice(start, end);
  }, [page, doadores]);


    const handleDelete = async () => {
        const response = await fetch(`/api/doador?codigo=${codigo}`, {
        method: "DELETE",
        });
    
        if (response.ok) {
        alert("Doador deletado com sucesso");
        } else {
        alert("Erro ao deletar doador");
        }
        location.reload();
    };

   const renderCell = useCallback((doador: any, columnKey: any) => {
      const cellValue = doador[columnKey];
  
      switch (columnKey) {
        case "tipoSanguineo":
          return (
            <span className="w-full text-center">{`${cellValue} ${doador.rh === "POSITIVO" ? "+" : "-"}`}</span>
          );
        case "tipoRhCorretos":
          return cellValue ? (
            <span className="text-green-700 font-bold">Sim</span>
          ) : (
            <span className="text-red-700 font-bold">Não</span>
          );
        case "actions":
          return (
              <ButtonGroup>
                  <Button color="success">
                  <Link href={`/doacao?codigo=${doador.codigo}`}>Doar</Link>
                  </Button>
                  <Button color="primary">
                  <Link href={`/mudaDoador?codigo=${doador.codigo}`}>Mudar</Link>
                  </Button>
                  <Button color="danger" onPress={onOpen} onClick={() => setCodigo(doador.codigo)}>
                      Deletar
                  </Button>
              </ButtonGroup>
              );
  
        default:
          return cellValue;
      }
    }, [onOpen]);

  useEffect(() => {
    async function fetchDoadores() {
      const response = await fetch("/api/doador?" + searchParams.toString());
      const data = await response.json();
      setDoadores(data);
      setLoading(false);
    }

    fetchDoadores();
  }, [searchParams]);

  return (
    <main>
      {loading ? <Spinner className="mb-3" />
      :<Table className="w-[800px] h-[500px]" topContent={
        <Button className="w-max">
            <Link href="/resultDoador">
            Tirar Filtros
            </Link>
        </Button>
      }>
        <TableHeader columns={columns}>
          {(column: Column) => (
            <TableColumn
              key={column.key}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item: Doador) => (
            <TableRow key={item.codigo}>
              {(columnKey: any) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>}
      <div className="w-[800px] flex flex-col justify-start gap-x-2">
        {pages > 1 && <Pagination
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
            />}
      </div>


      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h1 className="text-red-500">DELETAR DOADOR</h1>
              </ModalHeader>
              <ModalBody>
                <p>
                  Você tem certeza que deseja{" "}
                  <strong className="text-red-500">DELETAR</strong> esse
                  doador?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="bordered" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={onClose}
                  onClick={() => handleDelete()}
                >
                  Deletar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
