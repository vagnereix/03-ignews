import { render, screen } from '@testing-library/react'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { mocked } from 'ts-jest/utils'
import { getSession } from 'next-auth/client'
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic')
jest.mock('next-auth/client')

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post content</p>',
  updatedAt: '01 de abril de 2021',
}

describe('Post page', () => {
  it('should to renders correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post content')).toBeInTheDocument()
  })

  it('should redirects user to post preview if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession)
    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: {
        slug: post.slug,
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({ // Verifica se o objeto contém essas props
        redirect: {
          destination: `/posts/preview/${post.slug}`,
          permanent: false,
        },
      })
    )
  })

  it('should to loads initial data', async () => {
    const getSessionMocked = mocked(getSession)
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    } as any)

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

    const response = await getServerSideProps({
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
