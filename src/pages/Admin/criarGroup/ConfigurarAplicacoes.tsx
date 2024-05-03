import PainelAdmin from '../../../components/logo/painelAdmin/PainelAdmin';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { useStore } from '../../../context/store';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ConfigAplicacao() {
    const numRounds = useStore((state) => state.numRounds);
    const nomeUnidade = useStore((state) => state.nomeUnidade);
    const nEuros = useStore((state) => state.nEuros);
    const setNEuros = useStore((state) => state.setNEuros);
    const retribuicao = useStore((state) => state.retribuicao);
    const setRetribuicao = useStore((state) => state.setRetribuicao);
    const qntRetribuicao = useStore((state) => state.qntRetribuicao);
    const setQuantidadeRetribuicao = useStore(
        (state) => state.setQntRetribuicao,
    );
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState(nomeUnidade);

    const handleNEurosChange = (
        i: number,
        value: string | null | undefined,
    ) => {
        if (value !== undefined && value !== null) {
            const newNEuros = [...nEuros];
            newNEuros[i] = String(value);
            setNEuros(newNEuros);
        }
    };

    const handleRetribuicaoChange = (
        i: number,
        value: string | null | undefined,
    ) => {
        if (value !== undefined && value !== null) {
            const newRetribuicao = [...retribuicao];
            newRetribuicao[i] = String(value);
            setRetribuicao(newRetribuicao);
        }
    };

    const handleQuantidadeRetribuicaoChange = (
        i: number,
        value: string | null | undefined,
    ) => {
        if (value !== undefined && value !== null) {
            const newQuantidadeRetribuicao = [...qntRetribuicao];
            newQuantidadeRetribuicao[i] = String(value);
            setQuantidadeRetribuicao(newQuantidadeRetribuicao);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const grupo = {
            name: groupName,
            rodada: Array.from({ length: parseInt(numRounds) }, (_, i) => ({
                nEuro: nEuros[i],
                retribuicao: retribuicao[i],
                qntRetribuicao: qntRetribuicao[i],
                nRodada: String(i + 1),
            })),
        };

        try {
            const response = await axios.post(
                'http://localhost:3333/group',
                grupo,
            );
            if (response.status === 201) {
                navigate('/admin/painel-controll');
            } else {
                alert('Erro ao criar grupo');
            }
        } catch (error: unknown) {
            if (error instanceof Error && error.message === '409') {
                alert('Grupo já existe');
            } else {
                console.log(error);
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <PainelAdmin>
                <div className="flex flex-col items-center gap-5">
                    <div className="flex text-center">
                        <label className="mb-4 block text-xl">
                            Nome da unidade:
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="mt-1 block max-w-32 rounded-md border border-orange-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </label>
                    </div>
                    <div>
                        <Tabs className="flex">
                            <TabList className="flex flex-col space-y-3 border-r-2 p-4">
                                {Array.from(
                                    { length: parseInt(numRounds) },
                                    (_, i) => (
                                        <Tab
                                            key={i}
                                            className="cursor-pointer rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                                        >
                                            Rodada {i + 1}
                                        </Tab>
                                    ),
                                )}
                            </TabList>

                            <div className="flex-grow p-4">
                                {Array.from(
                                    { length: parseInt(numRounds) },
                                    (_, i) => (
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
                                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                />
                                            </label>

                                            <label className="mb-4 block">
                                                Retribuição:
                                                <select
                                                    value={
                                                        retribuicao[i] !==
                                                            undefined &&
                                                        retribuicao[i] !== null
                                                            ? retribuicao[i]
                                                            : ''
                                                    }
                                                    onChange={(e) =>
                                                        handleRetribuicaoChange(
                                                            i,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                >
                                                    <option value="">
                                                        Selecione uma opção
                                                    </option>
                                                    <option value="Porcentual">
                                                        Porcentual
                                                    </option>
                                                    <option value="Valor Inteiro">
                                                        Valor Inteiro
                                                    </option>
                                                </select>
                                            </label>

                                            <label className="mb-4 block">
                                                Quantidade de Retribuição:
                                                <input
                                                    type="number"
                                                    value={
                                                        qntRetribuicao[i] !==
                                                        undefined
                                                            ? qntRetribuicao[i]
                                                            : ''
                                                    }
                                                    onChange={(e) =>
                                                        handleQuantidadeRetribuicaoChange(
                                                            i,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                />
                                            </label>
                                        </TabPanel>
                                    ),
                                )}
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
