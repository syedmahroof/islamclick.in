import ArticleForm from './Form';
import { PageProps } from '@/types';

type Article = {
    id: number;
    title: string;
    content: string;
    status: 'draft' | 'published';
};

type Props = {
    article: Article;
} & PageProps;

export default function EditArticle({ auth, article }: Props) {
    return <ArticleForm auth={auth} article={article} />;
}
