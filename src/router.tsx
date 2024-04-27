import { Route, Routes } from 'react-router-dom';
import LoginAdmin from './pages/Admin/LoginAdmin';
import CriarUnidade from './pages/Admin/CriarUnidade';
import ConfigAplicacao from './pages/Admin/ConfigurarAplicacoes';

export function Router() {
    return (
        <Routes>
            <Route path="/admin" element={<LoginAdmin />} />
            <Route path="/admin/criar-unidade" element={<CriarUnidade />} />
            <Route
                path="/admin/configurar-aplicacoes"
                element={<ConfigAplicacao />}
            />
        </Routes>
    );
}
