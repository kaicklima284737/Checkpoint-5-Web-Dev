// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function obterPrecoNumerico(valor) {
  const numero = Number(valor)
  return !isNaN(numero) && valor !== undefined && valor !== null ? numero : null
}

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => {
    const preco = obterPrecoNumerico(produto?.price)
    return preco === null ? total : total + preco
  }, 0)
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
