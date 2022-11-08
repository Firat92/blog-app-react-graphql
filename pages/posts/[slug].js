/* eslint-disable @next/next/no-img-element */

import styles from '../../styles/Slug.module.css';
import { GraphQLClient, gql } from 'graphql-request';

const graphcms = new GraphQLClient(
	'https://api-us-east-1.hygraph.com/v2/cl9s7ta1x1nn001ui87cue5lg/master'
);

const QUERY = gql`
	query Post($slug: String!) {
		post(where: { slug: $slug }) {
			id
			title
			slug
			datePublished
			author {
				id
				name
				avatar {
					url
				}
			}
			content {
				html
			}
			coverPhoto {
				id
				url
			}
		}
	}
`;

const SLUGLIST = gql`
	{
		posts {
			slug
		}
	}
`;

export async function getStaticPaths() {
	const { posts } = await graphcms.request(SLUGLIST);
	return {
		paths: posts.map((post) => ({ params: { slug: post.slug } })),
		fallback: false,
	};
}

export async function getStaticProps({ params }) {
	const slug = params.slug;
	const data = await graphcms.request(QUERY, { slug });
	const post = data.post;
	return {
		props: {
			post,
		},
		revalidate: 10,
	};
}

export default function BlogPost({ post }) {
	return (
		<main className={styles.bg}>
			<div className={styles.blog}>
				<img src={post.coverPhoto.url} className={styles.cover} alt='' />

				<div className={styles.title}>
					<img src={post.author.avatar.url} alt='' />
					<div className={styles.authtext}>
						<div className={styles.new}>
							<div className={styles.date}>By {post.author.name}</div>
							<div>{post.datePublished}</div>
						</div>
					</div>
				</div>

				<h2>{post.title}</h2>
				<div
					className={styles.content}
					dangerouslySetInnerHTML={{ __html: post.content.html }}
				></div>
			</div>
		</main>
	);
}

//
