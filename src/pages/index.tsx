import Head from "next/head";
import styles from "./home.module.scss";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import { GetStaticProps } from "next";

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

// Toda página precisa ser *Default*
export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1ItzjfJtKYcU85lH7KSGRrok", {
    expand: ["product"], // VEM TODAS AS INFOS DO PRODUTO AO INVÉS DE SOMENTE O ID
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
