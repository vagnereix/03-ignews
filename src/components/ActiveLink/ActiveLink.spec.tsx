import { render } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      }
    }
  }
})

describe('ActiveLink component', () => {
  it('should to renders correctly', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    )
  
    expect(getByText('Home')).toBeInTheDocument()
  })
  
  it('should to receive active class if the path is the same as the href', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    )
  
    expect(getByText('Home')).toHaveClass('active')
  })
})
