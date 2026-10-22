import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'
import {
  adicionarProdutoAoCarrinho,
  atualizarEstoqueProduto,
  obterPrecoNumerico,
  removerProdutoDoCarrinho,
} from './utils/carrinho'

function normalizarProduto(produto) {
  const preco = obterPrecoNumerico(produto.price)

  return {
    ...produto,
    price: preco,
    precoOriginal: produto.precoOriginal ? obterPrecoNumerico(produto.precoOriginal) : undefined,
  }
}

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [listaEspera, setListaEspera] = useState([])
  const [cupomsUsados, setCupomsUsados] = useState([])

  useEffect(() => {
    buscarProdutos()
      .then((dados) => {
        const produtosNormalizados = dados
          .map(normalizarProduto)
          .filter((produto) => produto.price !== null && produto.price !== undefined)

        setProdutos(produtosNormalizados)
      })
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  function adicionarAoCarrinho(produto) {
    if (!produto || obterPrecoNumerico(produto.price) === null || produto.estoque === 0) {
      return
    }

    setCarrinho((carrinhoAtual) => adicionarProdutoAoCarrinho(carrinhoAtual, produto))
    setProdutos((produtosAtuais) => atualizarEstoqueProduto(produtosAtuais, produto.id, -1))
  }

  function removerUmaUnidade(produtoId) {
    setCarrinho((carrinhoAtual) => removerProdutoDoCarrinho(carrinhoAtual, produtoId))
    setProdutos((produtosAtuais) => atualizarEstoqueProduto(produtosAtuais, produtoId, 1))
  }

  function registrarAviso({ produtoId, produtoNome, nome, email }) {
    setListaEspera((atual) => {
      const jaRegistrado = atual.some(
        (item) => item.produtoId === produtoId && item.email.toLowerCase() === email.toLowerCase()
      )

      if (jaRegistrado) {
        return atual
      }

      return [
        ...atual,
        {
          id: Date.now().toString(),
          produtoId,
          produtoNome,
          nome,
          email,
        },
      ]
    })
  }

  function registrarUsoCupom(clienteId) {
    setCupomsUsados((atual) => {
      if (atual.includes(clienteId)) {
        return atual
      }
      return [...atual, clienteId]
    })
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)
  const cupomJaUsado = clienteAtual ? cupomsUsados.includes(clienteAtual.id) : false

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  onAdicionar={adicionarAoCarrinho}
                  onRegistrarAviso={registrarAviso}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  cupomJaUsado={cupomJaUsado}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                  onRegistrarUsoCupom={registrarUsoCupom}
                />
              }
            />
            <Route path="/estoque" element={<Estoque produtos={produtos} listaEspera={listaEspera} />} />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}
