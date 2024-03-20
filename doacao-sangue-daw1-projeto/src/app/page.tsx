"use client"
import Link from "next/link";
import { useEffect, useState } from "react";


export default function Home() {

  useEffect(()=>{
    const form = document.querySelector("form");
    form?.addEventListener('submit', e => {
        
        e.preventDefault();
        const {target: [texto, inteiro, booleano, seletor]} = e;

        const radios = document.querySelector('input[name="radios"]:checked')

        fetch(`/api?text=${texto.value}&inteiro=${inteiro.value}&booleano=${booleano.checked}&radios=${radios.labels[0].innerText.replace(" ","_")}&seletor=${seletor.value}`).then(res => res.json()).then(r => console.log(r));
  
        
        
    })
    

  },[])
  return (
    <main className="flex flex-col justify-center items-center h-screen">
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

    </main>
  );
}
