import { Link, useParams } from 'react-router'
import { useState } from 'react'
import ProdutoCard from '../components/ProdutoCard'

export default function PaginaProduto({ produtos, onAdicionar, onRegistrarAviso }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const relacionados = produtos
    .filter((item) => item.estoque > 0 && item.category === produto.category && item.id !== produto.id)
    .slice(0, 4)
  const valorRestanteFrete = Math.max(0, 200 - Number(produto.price || 0))

  function enviarAviso(evento) {
    evento.preventDefault()

    if (!nome.trim() || !email.trim() || !email.includes('@')) {
      setMensagem('Preencha nome e e-mail válidos para receber o aviso.')
      return
    }

    onRegistrarAviso({
      produtoId: produto.id,
      produtoNome: produto.title,
      nome: nome.trim(),
      email: email.trim(),
    })

    setMensagem('Você foi cadastrado para receber o aviso quando o produto voltar.')
    setNome('')
    setEmail('')
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">R$ {Number(produto.price).toFixed(2).replace('.', ',')}</p>
          <p className={Number(produto.price) >= 200 ? 'frete-gratis' : 'frete-restante'}>
            {Number(produto.price) >= 200
              ? 'Frete grátis'
              : `Faltam R$ ${valorRestanteFrete.toFixed(2).replace('.', ',')} para frete grátis`}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          <button
            className="botao botao-grande"
            onClick={() => onAdicionar(produto)}
            disabled={produto.estoque === 0 || isNaN(Number(produto.price))}
          >
            Adicionar ao carrinho
          </button>

          {produto.estoque === 0 && (
            <form onSubmit={enviarAviso} className="formulario-aviso">
              <h2>Avise-me quando voltar</h2>
              <label>
                Nome
                <input
                  type="text"
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value)}
                  required
                />
              </label>
              <label>
                E-mail
                <input
                  type="email"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  required
                />
              </label>
              <button type="submit" className="botao botao-secundario">
                Quero receber o aviso
              </button>
              {mensagem && <p className="mensagem-cupom">{mensagem}</p>}
            </form>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />
        ))}
      </div>
    </section>
  )
}
