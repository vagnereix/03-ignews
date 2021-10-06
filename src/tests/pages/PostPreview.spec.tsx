import { render, screen } from '@testing-library/react'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { mocked } from 'ts-jest/utils'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic')
jest.mock('next-auth/client')
jest.mock('next/router')

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post content</p>',
  updatedAt: '01 de abril de 2021',
}

describe('Post page', () => {
  it('should to renders correctly', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])

    render(<Post post={post} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post content')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('should redirects user to full post when user is subscribed', async () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-active-subscription' },
      false
    ])

    const pushMock = jest.fn();
    const useRouterMocked = mocked(useRouter)
    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(<Post post={post} />)
    expect(pushMock).toHaveBeenCalledWith(`/posts/${post.slug}`)
  })

  it('should to loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My New Post' },
          ],
          content: [
            { type: 'paragraph', text: 'Post content' }
          ],
        },
        last_publication_date: '04-01-2021',
      }),
    } as any)

    const response = await getStaticProps({
      params: {
        slug: post.slug,
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post,
        },
      })
    )
  })
})
