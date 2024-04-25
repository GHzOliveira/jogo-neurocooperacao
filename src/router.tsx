import { Route, Routes } from 'react-router-dom';
import LoginAdmin from './pages/Admin/LoginAdmin';
import PainelControle from './pages/Admin/PainelControle';

export function Router() {
    return (
        <Routes>
            <Route path="/admin" element={<LoginAdmin />} />
            <Route path="/admin/painel-controle" element={<PainelControle />} />
        </Routes>
    );
}
