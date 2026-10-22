import test from 'node:test'
import assert from 'node:assert/strict'
import {
    adicionarProdutoAoCarrinho,
    removerProdutoDoCarrinho,
    atualizarEstoqueProduto,
} from './carrinho.js'

test('adicionarProdutoAoCarrinho deve acrescentar uma unidade no carrinho', () => {
    const carrinho = [{ id: 7, title: 'Copo Térmico' }]

    const atualizado = adicionarProdutoAoCarrinho(carrinho, { id: 7, title: 'Copo Térmico' })

    assert.equal(atualizado.length, 2)
    assert.deepEqual(atualizado[1], { id: 7, title: 'Copo Térmico' })
})

test('removerProdutoDoCarrinho deve remover apenas uma unidade do produto', () => {
    const carrinho = [
        { id: 3, title: 'Camiseta Estampada' },
        { id: 3, title: 'Camiseta Estampada' },
        { id: 9, title: 'Teclado' },
    ]

    const atualizado = removerProdutoDoCarrinho(carrinho, 3)

    assert.equal(atualizado.length, 2)
    assert.deepEqual(
        atualizado.map((item) => item.id),
        [3, 9],
    )
})

test('atualizarEstoqueProduto deve reduzir o estoque de forma segura', () => {
    const produtos = [
        { id: 4, title: 'Mouse', estoque: 2 },
        { id: 5, title: 'Monitor', estoque: 0 },
    ]

    const atualizado = atualizarEstoqueProduto(produtos, 4, -1)

    assert.equal(atualizado[0].estoque, 1)
    assert.equal(atualizado[1].estoque, 0)
})
