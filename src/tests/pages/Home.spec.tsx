import { render, screen } from '@testing-library/react'
import Home, { getStaticProps } from '../../pages'
import { stripe } from '../../services/stripe'
import { mocked } from 'ts-jest/utils'

jest.mock('next/router')
jest.mock('../../services/stripe')
jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false]
    }
  }
})

describe('Home page', () => {
  it('should to renders correctly', () => {
    render(<Home product={{ priceId: 'fake-price-id', amount: 'R$10,00' }} />)

    expect(screen.getByText(/R\$10,00/i)).toBeInTheDocument()
  })

  it('should to loads initial data', async () => {
    const stripePricesRetrieveMocked = mocked(stripe.prices.retrieve)
    stripePricesRetrieveMocked.mockResolvedValueOnce({ // Utilizado quando a função é uma Promise
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any)

    const response = await getStaticProps({})
    expect(response).toEqual(
      expect.objectContaining({ // Verifica se o objeto contém essas props
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00',
          }
        }
      })
    )
  })
})
