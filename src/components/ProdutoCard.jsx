import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'

export default function ProdutoCard({ produto, onAdicionar }) {
  const esgotado = produto.estoque === 0
  const precoValido = !isNaN(Number(produto.price)) && produto.price !== undefined && produto.price !== null
  const precoNumerico = Number(produto.price)
  const freteGratisNoProduto = precoNumerico >= 200
  const valorRestanteFrete = Math.max(0, 200 - precoNumerico)

  return (
    <article className="card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      <p className="card-avaliacao">
        ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
      </p>

      <div className="card-precos">
        {produto.precoOriginal && (
          <span className="preco-original">{formatarPreco(produto.precoOriginal)}</span>
        )}
        <span className="preco">{formatarPreco(produto.price)}</span>
      </div>

      <p className={freteGratisNoProduto ? 'frete-gratis' : 'frete-restante'}>
        {freteGratisNoProduto ? 'Frete grátis' : `Faltam ${formatarPreco(valorRestanteFrete)} para frete grátis`}
      </p>

      <div className="card-selos">
        {freteGratisNoProduto && <span className="selo selo-frete">Frete grátis</span>}
        {esgotado && <span className="selo selo-esgotado">Esgotado</span>}
      </div>

      <button className="botao" onClick={() => onAdicionar(produto)} disabled={esgotado || !precoValido}>
        Adicionar ao carrinho
      </button>
    </article>
  )
}
