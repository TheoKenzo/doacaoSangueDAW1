
export default function page({searchParams}:any) {
  return (
    <div>Rota executou com sucesso recebendo o valor {searchParams.valor} e quantidade {searchParams.quantidade}!</div>
  )
}
