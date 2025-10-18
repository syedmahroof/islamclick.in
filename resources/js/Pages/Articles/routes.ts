import { createRoutesFromElements, Route } from 'react-router-dom';
import Index from './Index';
import Create from './Create';
import Edit from './Edit';

export const articleRoutes = createRoutesFromElements(
    <Route path="articles">
        <Route index element={<Index />} />
        <Route path="create" element={<Create />} />
        <Route path=":id/edit" element={<Edit />} />
    </Route>
);
