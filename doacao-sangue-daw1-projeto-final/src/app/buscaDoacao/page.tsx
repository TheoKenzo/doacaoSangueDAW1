"use client";
import { CalendarDate, DateValue, getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Checkbox } from "@nextui-org/checkbox";
import { DateRangePicker } from "@nextui-org/date-picker";
import { Input } from "@nextui-org/input";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Select, SelectItem } from "@nextui-org/select";
import { Doador } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function BuscaDoador() {
  const [doadores, setDoadores] = useState<Doador[]>([]);
  const [data, setData] = useState<{start: DateValue, end: DateValue}|null>(null);
  const router = useRouter();
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const form = new FormData(event.target as HTMLFormElement);
    const doador = form.get("doador") as string;
    const tipoSanguineo = form.get("tipoSanguineo") as string;
    const rh = form.get("rh") as string;

    const searchParams = new URLSearchParams();

    if (doador){
      searchParams.append("codigo", doador.split(" - ")[0]);
    }
    if (tipoSanguineo && tipoSanguineo != "TODOS")
      searchParams.append("tipoSanguineo", tipoSanguineo);
    if (rh && rh != "TODOS") searchParams.append("rh", rh);

    if (data){
      searchParams.append("start", data.start.toString());
      searchParams.append("end", data.end.toString());
    }
    console.log(searchParams.toString());
    router.push("/resultDoacao?" + searchParams.toString());

    // Clear form
    //(event.target as HTMLFormElement).reset();
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
      <Card className="w-[400px] h-max">
        <CardHeader>
          <h1 className="w-full text-2xl font-bold text-center">
            Buscar Doação
          </h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4 grid">
            <Autocomplete
              defaultItems={doadores}
              variant="bordered"
              label="Doador"
              placeholder="Selecione um Doador"
              labelPlacement="inside"
              isLoading={doadores.length === 0}
              name="doador"
              allowsCustomValue
            >
              {(user) => (
                <AutocompleteItem key={user.codigo} textValue={`${user.codigo} - ${user.nome}`}>
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
            <DateRangePicker label="Período de Doação"
              calendarProps={{
                className: "w-[280px]",
              }}
              onChange={(value) => setData({
                start: value.start,
                end: value.end,
              })}
              maxValue={today(getLocalTimeZone())}
             />
            <Select
              label="Tipo Sanguíneo"
              placeholder="Selecione"
              name="tipoSanguineo"
              defaultSelectedKeys={["TODOS"]}
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
              <SelectItem key="TODOS" value="TODOS">
                Todos
              </SelectItem>
            </Select>
            <RadioGroup
              name="rh"
              label="Rh"
              orientation="horizontal"
              defaultValue="TODOS"
            >
              <Radio key="positivo" value="POSITIVO">
                Positivo
              </Radio>
              <Radio key="negativo" value="NEGATIVO">
                Negativo
              </Radio>
              <Radio key="todos" value="TODOS">
                Todos
              </Radio>
            </RadioGroup>
            <Button type="submit" className="justify-self-center">
              Buscar
            </Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
