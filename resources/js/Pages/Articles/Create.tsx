import ArticleForm from './Form';
import { PageProps } from '@/types';

export default function CreateArticle({ auth }: PageProps) {
    return <ArticleForm auth={auth} />;
}
