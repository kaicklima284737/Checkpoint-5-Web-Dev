const CUPONS = {
  PRIMEIRACOMPRA: 0.1,
}

export function normalizarCodigoCupom(codigo) {
  return String(codigo ?? '').trim().toUpperCase()
}

export function validarCupom(codigo, cliente, cupomJaUsado) {
  const codigoNormalizado = normalizarCodigoCupom(codigo)
  const desconto = CUPONS[codigoNormalizado]

  if (!desconto) {
    return { valido: false, mensagem: 'Cupom inválido' }
  }

  if (!cliente) {
    return { valido: false, mensagem: 'Selecione um cliente para aplicar o cupom.' }
  }

  if (cupomJaUsado) {
    return { valido: false, mensagem: 'Cupom Já Usado' }
  }

  if (codigoNormalizado === 'PRIMEIRACOMPRA' && cliente.pedidosAnteriores > 0) {
    return { valido: false, mensagem: 'Cupom inválido' }
  }

  return { valido: true, desconto, mensagem: 'Cupom aplicado!' }
}
