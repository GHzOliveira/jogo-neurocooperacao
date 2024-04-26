import PainelAdmin from '../../components/logo/painelAdmin/PainelAdmin';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { useStore } from '../../context/store';

export default function ConfigAplicacao() {
    const numRounds = useStore((state) => state.numRounds);
    const nomeUnidade = useStore((state) => state.nomeUnidade);
    const nEuros = useStore((state) => state.nEuros);
    const setNEuros = useStore((state) => state.setNEuros);
    const retribuicao = useStore((state) => state.retribuicao);
    const setRetribuicao = useStore((state) => state.setRetribuicao);
    const quantidadeRetribuicao = useStore(
        (state) => state.quantidadeRetribuicao,
    );
    const setQuantidadeRetribuicao = useStore(
        (state) => state.setQuantidadeRetribuicao,
    );

    const handleNEurosChange = (
        i: number,
        value: string | null | undefined,
    ) => {
        if (value !== undefined && value !== null) {
            const newNEuros = [...nEuros];
            newNEuros[i] = value;
            setNEuros(newNEuros);
        }
    };

    const handleRetribuicaoChange = (
        i: number,
        value: string | null | undefined,
    ) => {
        if (value !== undefined && value !== null) {
            const newRetribuicao = [...retribuicao];
            newRetribuicao[i] = value;
            setRetribuicao(newRetribuicao);
        }
    };

    const handleQuantidadeRetribuicaoChange = (
        i: number,
        value: string | null | undefined,
    ) => {
        if (value !== undefined && value !== null) {
            const newQuantidadeRetribuicao = [...quantidadeRetribuicao];
            newQuantidadeRetribuicao[i] = value;
            setQuantidadeRetribuicao(newQuantidadeRetribuicao);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const grupo = {
            nomeUnidade,
            numRounds,
        };
        const roundsConfig = Array.from({ length: numRounds }, (_, i) => ({
            round: i + 1,
            nEuros: nEuros[i],
            retribuicao: retribuicao[i],
            quantidadeRetribuicao: quantidadeRetribuicao[i],
        }));

        console.log(grupo);
        console.log(roundsConfig);
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <PainelAdmin>
                <div className="flex flex-col items-center gap-5">
                    <h1 className="mb-1 text-center text-2xl font-bold">
                        Unidade: {nomeUnidade}
                    </h1>
                    <div>
                        <Tabs className="flex">
                            <TabList className="flex flex-col space-y-3 border-r-2 p-4">
                                {Array.from({ length: numRounds }, (_, i) => (
                                    <Tab
                                        key={i}
                                        className="cursor-pointer rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                                    >
                                        Rodada {i + 1}
                                    </Tab>
                                ))}
                            </TabList>

                            <div className="flex-grow p-4">
                                {Array.from({ length: numRounds }, (_, i) => (
                                    <TabPanel key={i}>
                                        <h2 className="mb-4 text-lg font-bold">
                                            Configurações Rodada {i + 1}
                                        </h2>
                                        <label className="mb-4 block">
                                            Número de nEuros:
                                            <input
                                                type="number"
                                                value={
                                                    nEuros[i] !== undefined
                                                        ? nEuros[i]
                                                        : ''
                                                }
                                                onChange={(e) =>
                                                    handleNEurosChange(
                                                        i,
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                        </label>

                                        <label className="mb-4 block">
                                            Retribuição:
                                            <select
                                                value={
                                                    retribuicao[i] !== undefined
                                                        ? retribuicao[i]
                                                        : 'Porcentual'
                                                }
                                                onChange={(e) =>
                                                    handleRetribuicaoChange(
                                                        i,
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            >
                                                <option></option>
                                                <option>Porcentual</option>
                                                <option>Valor Inteiro</option>
                                            </select>
                                        </label>

                                        <label className="mb-4 block">
                                            Quantidade de Retribuição:
                                            <input
                                                type="number"
                                                value={
                                                    quantidadeRetribuicao[i] !==
                                                    undefined
                                                        ? quantidadeRetribuicao[
                                                              i
                                                          ]
                                                        : ''
                                                }
                                                onChange={(e) =>
                                                    handleQuantidadeRetribuicaoChange(
                                                        i,
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                        </label>
                                    </TabPanel>
                                ))}
                            </div>
                        </Tabs>
                    </div>
                    <div>
                        <button
                            className="rounded-xl bg-[#ff7d0d] p-3 text-black"
                            onClick={handleSubmit}
                        >
                            Criar Grupo
                        </button>
                    </div>
                </div>
            </PainelAdmin>
        </div>
    );
}
