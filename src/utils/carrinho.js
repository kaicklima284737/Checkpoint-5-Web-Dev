// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function obterPrecoNumerico(valor) {
  const numero = Number(valor)
  return !isNaN(numero) && valor !== undefined && valor !== null ? numero : null
}

export function adicionarProdutoAoCarrinho(carrinho, produto) {
  if (!produto) {
    return carrinho
  }

  return carrinho.concat(produto)
}

export function removerProdutoDoCarrinho(carrinho, produtoId) {
  const indice = carrinho.findIndex((produto) => produto.id === produtoId)

  if (indice === -1) {
    return carrinho
  }

  return carrinho.filter((produto, index) => index !== indice)
}

export function atualizarEstoqueProduto(produtos, produtoId, delta) {
  return produtos.map((produto) => {
    if (produto.id !== produtoId) {
      return produto
    }

    const estoqueAtual = Number(produto.estoque ?? 0)
    return {
      ...produto,
      estoque: Math.max(0, estoqueAtual + delta),
    }
  })
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
