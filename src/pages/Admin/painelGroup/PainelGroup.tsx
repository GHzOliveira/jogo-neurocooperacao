import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../../context/store';
import axios from 'axios';
import { Socket, io } from 'socket.io-client';

interface Round {
    id: string;
    nEuro: string;
    retribuicao: string;
    qntRetribuicao: string;
    nRodada: string;
}

export function PainelGroup() {
    const { groupId } = useParams();
    const groups = useStore((state) => state.groups);
    const group = groups.find((group) => group.id === groupId);
    const [rounds, setRounds] = useState<Round[]>([]);
    const [gameRule, setGameRule] = useState('');
    const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
    const [editingRoundData, setEditingRoundData] = useState<Round | null>(
        null,
    );
    const [socket, setSocket] = useState<Socket | null>(null);
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    if (!group) {
        return <div>Grupo não encontrado</div>;
    }

    useEffect(() => {
        const socketIo = io('https://35.160.120.126:3000');
        setSocket(socketIo);
        return () => {
            socketIo.close();
        };
    }, []);

    const handleGameRuleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log(gameRule);
        socket?.emit('sendGameRule', gameRule, groupId);
        socket?.emit('createGame', groupId);
        socket?.emit('joinGame', groupId);
        navigate(`/admin/start-group/${groupId}`);
    };

    useEffect(() => {
        socket?.on('gameRuleStored', (gameRule) => {
            console.log(`Regra do jogo armazenada com sucesso: ${gameRule}`);
        });
        return () => {
            socket?.off('gameRuleStored');
        };
    }, [socket]);

    const handleEditClick = (round: Round) => {
        setEditingRoundId(round.id);
        setEditingRoundData(round);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEditingRoundData(
            (prevState) =>
                ({
                    ...prevState,
                    [name as keyof Round]: value,
                }) as Round,
        );
    };

    const handleSaveClick = () => {
        if (editingRoundData) {
            axios
                .put(
                    `http://35.160.120.126:3333/group/${groupId}/round/${editingRoundId}`,
                    editingRoundData,
                )
                .then((response) => {
                    setRounds(
                        rounds.map((round) =>
                            round.id === editingRoundId ? response.data : round,
                        ),
                    );
                    setEditingRoundId(null);
                    setEditingRoundData(null);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    useEffect(() => {
        axios
            .get(`http://35.160.120.126:3333/group/${groupId}/rounds`)
            .then((response) => {
                setRounds(response.data.rodada);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [groupId]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex w-full max-w-xl justify-center">
                <form
                    onSubmit={handleGameRuleSubmit}
                    className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
                >
                    <h1 className="mb-5 text-center text-2xl">
                        Unidade {group.nome}
                    </h1>
                    <h2 className="mb-4 text-xl font-bold">
                        Informações da Unidade
                    </h2>
                    <div>
                        {rounds.map((round) => (
                            <div
                                key={round.id}
                                className="mb-4 rounded border p-4 shadow"
                            >
                                {editingRoundId === round.id ? (
                                    <div>
                                        <p className="text-lg font-semibold">
                                            nEuro
                                        </p>
                                        <input
                                            className="mb-5 border border-gray-600"
                                            name="nEuro"
                                            value={editingRoundData?.nEuro}
                                            onChange={handleInputChange}
                                        />
                                        <p className="text-lg font-semibold">
                                            Retribuição
                                        </p>
                                        <input
                                            className="mb-5 border border-gray-600"
                                            name="retribuicao"
                                            value={
                                                editingRoundData?.retribuicao
                                            }
                                            onChange={handleInputChange}
                                        />
                                        <p className="text-lg font-semibold">
                                            Quantidade de Retribuição
                                        </p>
                                        <input
                                            className="mb-5 border border-gray-600"
                                            name="qntRetribuicao"
                                            value={
                                                editingRoundData?.qntRetribuicao
                                            }
                                            onChange={handleInputChange}
                                        />
                                        <br />
                                        <button
                                            className="focus:shadow-outline rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                                            onClick={handleSaveClick}
                                        >
                                            Salvar
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="mb-2 text-xl font-bold">
                                            Rodada: {round.nRodada}
                                        </h2>
                                        <ul className="ml-5 list-disc">
                                            <li className="mb-1">
                                                nEuro: {round.nEuro}
                                            </li>
                                            <li className="mb-1">
                                                Retribuição: {round.retribuicao}
                                            </li>
                                            <li>
                                                Quantidade de Retribuição:{' '}
                                                {round.qntRetribuicao}
                                            </li>
                                        </ul>
                                        <button
                                            className="focus:shadow-outline mt-5 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                                            onClick={() =>
                                                handleEditClick(round)
                                            }
                                        >
                                            Editar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mb-4">
                        <label
                            className="mb-2 block text-xl font-bold text-gray-700"
                            htmlFor="gameRule"
                        >
                            Regra do Jogo
                        </label>
                        <textarea
                            id="gameRule"
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                            value={gameRule}
                            onChange={(event) =>
                                setGameRule(event.target.value)
                            }
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="focus:shadow-outline rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                            type="submit"
                        >
                            Criar Jogo
                        </button>
                        <button
                            onClick={handleBackClick}
                            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                        >
                            Voltar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
