import PainelAdmin from '../../components/logo/painelAdmin/PainelAdmin';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/store';

export default function CriarUnidade() {
    const nomeUnidade = useStore((state) => state.nomeUnidade);
    const numRounds = useStore((state) => state.numRounds);
    const setNomeUnidade = useStore((state) => state.setNomeUnidade);
    const setNumRounds = useStore((state) => state.setNumRounds);
    const navigate = useNavigate();

    const handleNomeUnidadeChange = (event: { target: { value: string } }) => {
        setNomeUnidade(event.target.value);
    };

    const handleNumRoundsChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setNumRounds(parseInt(event.target.value));
    };

    const handleCreateUnidade = () => {
        const unidade = {
            nome: nomeUnidade,
            rodadas: numRounds,
        };
        console.log(unidade);
        navigate('/admin/configurar-aplicacoes', {
            state: { numRounds, nomeUnidade },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <PainelAdmin>
                <div className="flex max-w-52 flex-col items-center gap-5">
                    <div>
                        <label>
                            <a className="mb-2 block text-sm font-bold text-gray-700">
                                Nome unidade
                            </a>
                        </label>
                        <input
                            className="focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                            id="nomeUnidade"
                            type="text"
                            placeholder="Nome da Unidade"
                            value={nomeUnidade}
                            onChange={handleNomeUnidadeChange}
                        />
                        <label
                            className="mb-2 block text-sm font-bold text-gray-700"
                            htmlFor="numRounds"
                        >
                            Número de rodadas
                        </label>
                        <input
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                            id="numRounds"
                            type="number"
                            placeholder="Número de Rodadas de Aplicação"
                            value={numRounds}
                            onChange={handleNumRoundsChange}
                        />
                    </div>
                    <div>
                        <button
                            className="focus:shadow-outline rounded bg-[#ff7d0d] px-4 py-2 font-bold text-white hover:bg-orange-600 focus:outline-none"
                            type="button"
                            onClick={handleCreateUnidade}
                        >
                            Criar Unidade
                        </button>
                    </div>
                </div>
            </PainelAdmin>
        </div>
    );
}
