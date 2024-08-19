import { useNavigate, useParams } from 'react-router-dom';
import PainelAdmin from '../../../components/logo/painelAdmin/PainelAdmin';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useStore } from '../../../context/store';
import axios from 'axios';

export function StartGroup() {
    const { groupId } = useParams();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const setStoreMessage = useStore((state) => state.setMessages);
    const [totalUsuarios, setTotalUsuarios] = useState(0);
    const navigate = useNavigate();

    const handleBackClick = (event: React.MouseEvent) => {
        event.preventDefault();
        navigate(-1);
    };

    useEffect(() => {
        const newSocket = io(
            'https://neurocoop-backend-2225c4ca4682.herokuapp.com',
        );
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log(
                `Conectado ao servidor Socket.io com o ID ${newSocket.id}`,
            );
        });

        newSocket.on('error', (message) => {
            console.error(message);
        });

        newSocket.on('storedMessage', (message) => {
            setMessage(message);
        });
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleStartGame = async () => {
        if (socket) {
            socket.emit('testMessage', 'Jogo Iniciado', groupId);
            setStoreMessage(['Jogo iniciado']);
        }

        try {
            const roundResponse = await axios.get(
                `https://neurocoop-backend-2225c4ca4682.herokuapp.com/group/${groupId}/round/1`,
            );
            const nEuro = roundResponse.data.nEuro;

            const usersResponse = await axios.get(
                'https://neurocoop-backend-2225c4ca4682.herokuapp.com/user',
            );
            const users = usersResponse.data;
            setTotalUsuarios(users.length);
            for (const user of users) {
                await axios.patch(
                    `https://neurocoop-backend-2225c4ca4682.herokuapp.com/user/${user.id}`,
                    {
                        nEuro,
                    },
                );
            }

            const totalUsuarios = users.length;
            await axios.patch(
                `https://neurocoop-backend-2225c4ca4682.herokuapp.com/group/${groupId}/applyNEuro`,
                {
                    totalUsuarios,
                    nEuro: '0',
                },
            );
        } catch (error) {
            console.error(`Erro ao buscar detalhes da rodada: ${error}`);
        }
    };

    const handleNextRound = async (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
        try {
            await axios.post(
                `https://neurocoop-backend-2225c4ca4682.herokuapp.com/group/${groupId}/next-round`,
            );
            if (socket) {
                socket.emit('nextRound', groupId);
                setStoreMessage(['Próxima rodada iniciada']);
            }
        } catch (error) {
            console.error(`Erro ao iniciar a próxima rodada: ${error}`);
        }
    };

    const handleRemovePlayers = async (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
        try {
            await axios.delete(
                `https://neurocoop-backend-2225c4ca4682.herokuapp.com/group/${groupId}/users`,
            );
            setStoreMessage(['Todos os jogadores foram removidos']);
        } catch (error) {
            console.error(`Erro ao remover jogadores: ${error}`);
        }
    };

    const handleResetValues = async (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
        try {
            await axios.patch(
                `https://neurocoop-backend-2225c4ca4682.herokuapp.com/group/${groupId}/reset-valores`,
            );
            setStoreMessage(['Valores resetados com sucesso']);
        } catch (error) {
            console.error(`Erro ao resetar valores: ${error}`);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <PainelAdmin>
                <div className="flex flex-col items-center">
                    <div>
                        <h1 className="mb-5 bg-white">
                            Se todos os jogadores entram na tela de Regra do
                            jogo clique em Iniciar jogo. Depois que todos
                            jogadores tiverem investido clique em Proxima rodada
                            (Espere todos os jogadores investirem!)
                        </h1>
                    </div>
                    {message && (
                        <div
                            className="mb-10 flex flex-col items-center border-l-4 border-green-500 bg-green-200 p-4 text-green-700"
                            role="alert"
                        >
                            <p className="mb-5 text-2xl">Rodada iniciada</p>
                            <div className="flex flex-col gap-5">
                                {/* <div className="rounded border border-gray-300 p-4">
                                    <h2 className="mb-4 text-center text-lg font-bold text-black">
                                        Lista de jogadores
                                    </h2>
                                </div> */}
                                <div className="flex flex-col gap-5">
                                    <button
                                        className="mt-5 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                                        onClick={handleNextRound}
                                    >
                                        Proxima Rodada
                                    </button>
                                    <button
                                        className="mt-5 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                                        onClick={handleRemovePlayers}
                                    >
                                        Remover Jogadores
                                    </button>
                                    <button
                                        className="mt-5 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                                        onClick={handleResetValues}
                                    >
                                        Resetar Valores
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between gap-10">
                        <div>
                            <button
                                className="focus:shadow-outline rounded bg-[#ff7d0d] px-4 py-2 font-bold text-white hover:bg-orange-600 focus:outline-none"
                                type="button"
                                onClick={handleStartGame}
                            >
                                Habilitar botão
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={handleBackClick}
                                className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            </PainelAdmin>
        </div>
    );
}
