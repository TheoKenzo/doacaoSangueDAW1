"use client";
import { CalendarDate, parseAbsoluteToLocal } from "@internationalized/date";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Checkbox } from "@nextui-org/checkbox";
import { DateInput, TimeInput } from "@nextui-org/date-input";
import { Input } from "@nextui-org/input";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Select, SelectItem } from "@nextui-org/select";
import { Doador } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [doadores, setDoadores] = useState<Doador[]>([]);
  const [pending, setPending] = useState(false);
  const searchParams = useSearchParams();
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.target as HTMLFormElement);
    const idDoador = form.get("doador") as string;
    const volume = form.get("volume") as string;
    const data = form.get("data") as string;
    const hora = form.get("hora") as string;
    const tipoSanguineo = form.get("tipoSanguineo") as string;
    const rh = form.get("rh") as string;
    const tipoRhCorretos = form.get("tipoRhCorretos") as string;

    const response = await fetch("/api/doacao", {
      method: "POST",
      body: JSON.stringify({
        id: idDoador.split(" - ")[0],
        volume,
        data,
        hora,
        tipoSanguineo,
        rh,
        tipoRhCorretos,
      }),
    });

    await fetch("/api/doador", {
        method: "PUT",
        body: JSON.stringify({
          codigo: idDoador.split(" - ")[0],
          tipoSanguineo,
          rh,
          tipoRhCorretos: "true",
        }),
      });

    setPending(false);

    // Clear form
    (event.target as HTMLFormElement).reset();

    if (response.ok) {
      alert("Doacao cadastrada com sucesso");
    } else {
      alert("Erro ao cadastrar doacao");
    }
  }

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/doador");
      const data = await res.json();
      setDoadores(data);
    })();
  }, []);

  return (
    <main className="h-screen flex flex-col items-center justify-center gap-y-2">
      <Card className="w-[400px] h-[570px]">
        <CardHeader>
          <h1 className="w-full text-2xl font-bold text-center">
            Cadastrar Doação
          </h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4 grid">
          <Autocomplete
              defaultItems={doadores}
              variant="bordered"
              label="Doador"
              defaultSelectedKey={searchParams.get("codigo") ?? ""}
              placeholder="Selecione um Doador"
              labelPlacement="inside"
              isLoading={doadores.length === 0}
              name="doador"
              allowsCustomValue
            >
              {(user) => (
                <AutocompleteItem key={user.codigo} value={user.codigo} textValue={`${user.codigo} - ${user.nome}`}>
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col">
                      <span className="text-small">{user.nome}</span>
                      <span className="text-tiny text-default-400">
                        {user.cpf}
                      </span>
                    </div>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>
            <Input
              label="volume"
              name="volume"
              placeholder="Digite o volume"
              isRequired
            />
            <DateInput
              label={"Data"}
              name="data"
              defaultValue={
                new CalendarDate(
                  new Date().getFullYear(),
                  new Date().getMonth() + 1,
                  new Date().getDate()
                )
              }
              isRequired
            />
            <TimeInput
              defaultValue={parseAbsoluteToLocal(new Date().toISOString())}
              label="Hora"
              name="hora"
              labelPlacement="outside"
              isRequired
            />

            <Select
              label="Tipo Sanguíneo"
              placeholder="Selecione"
              name="tipoSanguineo"
              isRequired
            >
              <SelectItem key="A" value="A">
                A
              </SelectItem>
              <SelectItem key="B" value="B">
                B
              </SelectItem>
              <SelectItem key="AB" value="AB">
                AB
              </SelectItem>
              <SelectItem key="O" value="O">
                O
              </SelectItem>
            </Select>
            <RadioGroup
              name="rh"
              label="Rh"
              orientation="horizontal"
              isRequired
            >
              <Radio key="positivo" value="POSITIVO">
                Positivo
              </Radio>
              <Radio key="negativo" value="NEGATIVO">
                Negativo
              </Radio>
            </RadioGroup>
            <Button
              type="submit"
              className="justify-self-center"
              isLoading={pending}
            >
              Cadastrar
            </Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
