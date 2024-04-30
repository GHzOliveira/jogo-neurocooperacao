import { Route, Routes } from 'react-router-dom';
import LoginAdmin from './pages/Admin/LoginAdmin';
import CriarUnidade from './pages/Admin/criarGroup/CriarUnidade';
import ConfigAplicacao from './pages/Admin/criarGroup/ConfigurarAplicacoes';
import PainelControllAdmin from './pages/Admin/PainelAdmin';
import { UserLogin } from './pages/user/UserLogin';
import { SalaEspera } from './pages/game/SalaEspera';
import { PainelGroup } from './pages/Admin/painelGroup/PainelGroup';
import { Rodada } from './pages/game/Rodadas/Rodada';
import { Aplicar } from './pages/game/Rodadas/Aplicar';
import { StartGroup } from './pages/Admin/painelGroup/StartGroup';

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<UserLogin />} />
            <Route
                path="/rodada/:groupId/round/:nRodada"
                element={<Rodada />}
            />
            <Route
                path="/rodada/:groupId/round/:nRodada/aplicar"
                element={<Aplicar />}
            />
            <Route path="/sala-espera/:groupId" element={<SalaEspera />} />
            <Route
                path="/admin/painel-group/:groupId"
                element={<PainelGroup />}
            />
            <Route
                path="/admin/start-group/:groupId"
                element={<StartGroup />}
            />
            <Route path="/admin" element={<LoginAdmin />} />
            <Route
                path="/admin/painel-controll"
                element={<PainelControllAdmin />}
            />
            <Route path="/admin/criar-unidade" element={<CriarUnidade />} />
            <Route
                path="/admin/configurar-aplicacoes"
                element={<ConfigAplicacao />}
            />
        </Routes>
    );
}
