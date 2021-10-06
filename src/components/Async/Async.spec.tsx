import { screen, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { Async } from '.'

describe('Async tests', () => {
  it('should to expect button be showed', async () => {
    const { debug } = render(<Async />)
    debug()

    expect(screen.getByText('Hello World!')).toBeInTheDocument()

    // Esperando o botão se tornar visível
      // expect(await screen.findByText('Button Visible', {}, { timeout: 1000 })).toBeInTheDocument()
    await waitFor(() => {
      return expect(screen.queryByText('Button Visible')).toBeInTheDocument()
    }, {
      timeout: 1000,
    })

    // Esperando o botão ser removido da tela/documento
      // await waitFor(() => {
      //   return expect(screen.queryByText('Button Invisible')).not.toBeInTheDocument()
      // })
    await waitForElementToBeRemoved(screen.queryByText('Button Invisible'), {
      timeout: 1000,
    })
  })
})

// Existem 3 tipos de métodos importados do screen

// Os que começam com get procuram um elemento de fora síncrona
//    e retorna erro caso não econtre

// Os que começam com query procuram um elemento de forma síncron mas
//    caso não econtre ele não retorna erro

// Os que começam com find procuram um elemento de forma assíncrona
//    esperando o mesmo aparecer, e caso não apareça retorna erro
