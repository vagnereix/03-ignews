import { render, screen, fireEvent } from '@testing-library/react'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { mocked } from 'ts-jest/utils'
import { SubscribeButton } from '.'


jest.mock('next-auth/client')
jest.mock('next/router')

describe('SubscribeButton component', () => {
  const useSessionMocked = mocked(useSession)
  useSessionMocked.mockReturnValueOnce([null, false])

  it('should to renders correctly', () => {
    render(
      <SubscribeButton />
    )
  
    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('should to redirects to sign in when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])
    const signInMocked = mocked(signIn)
    
    render(
      <SubscribeButton />
    )
      
    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton)
    expect(signInMocked).toHaveBeenCalled()
  })

  it('should to redirects to posts when user is authenticated', () => {
    const pushMock = jest.fn()
    const useRouterMocked = mocked(useRouter)
    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([{
      user: { name: 'John Doe', email: 'john@example.com'},
      activeSubscription: 'fake-active-subscription',
      expires: 'fake-expires',
    }, false])
    
    render(
      <SubscribeButton />
    )
      
    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton)
    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})
