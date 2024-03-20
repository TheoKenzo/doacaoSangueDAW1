'use client'
import { useEffect, FormEvent, useState } from "react";

interface FormElements extends HTMLFormControlsCollection {
  texto: HTMLInputElement;
  inteiro: HTMLInputElement;
  booleano: HTMLInputElement;
  seletor: HTMLSelectElement;
}

interface FormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function Home() {
  const [data, setData] = useState({})
  useEffect(() => {
    const form = document.querySelector("form") as FormElement;

    form?.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault();

      const texto = document.querySelector<HTMLInputElement>("#texto")?.value;
      const inteiro = document.querySelector<HTMLInputElement>("#inteiro")?.value;
      const booleano = document.querySelector<HTMLInputElement>("#booleano")?.checked;
      const seletor = document.querySelector<HTMLSelectElement>("#seletor")?.value;
      const radios = document.querySelector<HTMLInputElement>('input[name="radios"]:checked');
      const labelText = radios?.labels?.[0]?.innerText.replace(" ","_");

      fetch(`/api?texto=${texto}&inteiro=${inteiro}&booleano=${booleano}&radios=${labelText}&seletor=${seletor}`)
        .then(res => res.json())
        .then(r => setData(r));
    });
  }, []);

  return (
    <main className="flex flex-col justify-center items-center h-screen space-y-5">
      <form className="flex flex-col justify-center items-center w-[450px] h-[400px] bg-zinc-100 rounded-lg">
        <div className="flex flex-col justify-center space-y-3">
          <label htmlFor="texto">
            Texto: <input id="texto" type="text" />
          </label>

          <label htmlFor="inteiro">
            Inteiro: <input type="number" id="inteiro" />
          </label>

          <label htmlFor="booleano">
            Boolean: <input type="checkbox" id="booleano" />
          </label>

          <label htmlFor="seletor">
            Select: <select id="seletor">
                      <option value="1">opcao 1</option>
                      <option value="2">opcao 2</option>
                      <option value="3">opcao 3</option>
                    </select>
          </label>

          <legend>Radios: </legend>
          <div className="flex flex-col space-y-3">
            <div className="space-x-1">
              <input type="radio" name="radios" id="radio1" className="w-min" />
              <label htmlFor="radio1">opcao 1</label>
            </div>

            <div className="space-x-1">
              <input type="radio" name="radios" id="radio2" className="w-min" />
              <label htmlFor="radio2">opcao 2</label>
            </div>

            <div className="space-x-1">
              <input type="radio" name="radios" id="radio3" className="w-min" />
              <label htmlFor="radio3">opcao 3</label>
            </div>
          </div>

          <button type="submit" className="bg-purple-600 text-white rounded-lg">Enviar</button>
        </div>
      </form>

      <pre className="flex flex-col justify-center items-center w-[450px] h-[400px] bg-zinc-100 rounded-lg">
        {JSON.stringify(data, null, 2)}
      </pre>

    </main>
  );
}
