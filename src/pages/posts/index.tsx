import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import Link from 'next/link';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

type PostsProps = {
  posts: Post[],
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          { posts.map(post => (
            <Link key={post.slug} href={`posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          )) }
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'pu')
  ], {
    fetch: ['post.title', 'post.content'],
    pageSize: 100,
  })

  // Sempre preferir por formatar os dados no momemto em que a requisição é feita (formata uma única vez)
  // E não no momento do render no Componente (formata toda vez que a página é acessada)
  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find((content: { type: string; }) => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    }
  })

  return {
    props: {
      posts,
    }
  }
}
